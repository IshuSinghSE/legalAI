import { createHash } from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ANALYSIS_PROMPT } from '@/constant';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);



interface CacheEntry {
  summary: string;
  highlights: string[];
  extractedText: string;
  success: boolean;
}

// In-memory cache
const analysisCache = new Map<string, CacheEntry>();

export async function POST(request: Request) {
  try {
    console.log('Analyze API called');

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const selectedPages = formData.get('selectedPages') as string || 'all';

    console.log('File received:', file?.name, 'Size:', file?.size);

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Convert file to buffer for hashing and parsing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate a cache key from the file content and page selection
    const hash = createHash('sha256').update(buffer).digest('hex');
    const cacheKey = `${hash}-${selectedPages}`;

    // Check if the result is in the cache
    if (analysisCache.has(cacheKey)) {
      console.log('Returning cached analysis for key:', cacheKey);
      return new Response(JSON.stringify(analysisCache.get(cacheKey)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('No cache hit. Processing new analysis for key:', cacheKey);

    // Check if API key is available
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.error('GOOGLE_GEMINI_API_KEY not found');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Parsing PDF...');
    // Dynamically import pdfreader for PDF text extraction
    let PdfReader;
    try {
      ({ PdfReader } = await import('pdfreader'));
    } catch (importError) {
      console.error('Failed to import pdfreader:', importError);
      return new Response(JSON.stringify({ error: 'PDF parsing library not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    // Extract text from PDF using pdfreader
    const pdfReader = new PdfReader();
    let fullText = '';
    await new Promise<void>((resolve, reject) => {
      pdfReader.parseBuffer(buffer, (err: unknown, item: unknown) => {
        if (err) reject(err);
        else if (!item) resolve();
        else if (item && typeof item === 'object' && 'text' in item) fullText += (item as { text: string }).text + ' ';
      });
    });

    console.log('PDF parsed successfully. Text length:', fullText.length);

    // For now, use the full text. In the future, we could implement page selection based on selectedPages
    const textToAnalyze = fullText;

    if (!textToAnalyze || textToAnalyze.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Could not extract text from PDF' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get the analysis prompt
    const analysisPrompt = ANALYSIS_PROMPT;

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    // Create the full prompt
    const fullPrompt = `${analysisPrompt}\n\nDocument Content:\n${textToAnalyze}\n\nPlease provide your analysis in the specified format.`;

    console.log('Calling Gemini API...');
    // Generate analysis
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const analysisText = response.text();

    console.log('Gemini API response received, length:', analysisText.length);

    // Try to extract key points from the summary
    const lines = analysisText.split('\n');
    const keyPoints: string[] = [];

    for (const line of lines) {
      if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().match(/^\d+\./)) {
        keyPoints.push(line.trim());
      }
    }

    console.log('Extracted key points:', keyPoints.length);

    const analysisResult: CacheEntry = {
      summary: analysisText,
      highlights: keyPoints,
      extractedText: textToAnalyze.substring(0, 500) + '...',
      success: true
    };

    // Store the result in the cache
    analysisCache.set(cacheKey, analysisResult);
    console.log('Stored new analysis in cache. Key:', cacheKey);

    return new Response(JSON.stringify(analysisResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to analyze document',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
