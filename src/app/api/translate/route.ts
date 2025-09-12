import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import axios from 'axios';

// Azure AI credentials from environment variables
const translatorKey = process.env.AZURE_TRANSLATOR_KEY;
const translatorEndpoint = process.env.AZURE_TRANSLATOR_ENDPOINT;
const languageKey = process.env.AZURE_LANGUAGE_KEY;
const languageEndpoint = process.env.AZURE_LANGUAGE_ENDPOINT;

// interface TranslationRequest {
//   pdf?: File;
//   text?: string;
//   targetLanguage?: string;
// }

interface TranslationResponse {
  originalText: string;
  translatedText: string;
  detectedLanguage: string;
  targetLanguage: string;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('pdf') as File;
    const text = formData.get('text') as string;
    const targetLanguage = formData.get('targetLanguage') as string || 'fr';

    if (!file && !text) {
      return NextResponse.json({ error: 'No PDF file or text provided.' }, { status: 400 });
    }

    let extractedText = text;

    // If PDF file is provided, extract text from it
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Extract text from PDF
      const data = await pdf(buffer);
      extractedText = data.text;
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json({ error: 'No text found to translate.' }, { status: 400 });
    }

    // Step 1: Detect language if not specified
    let detectedLanguage = 'en'; // Default to English

    if (languageKey && languageEndpoint) {
      try {
        const detectResponse = await axios.post(`${languageEndpoint}/text/analytics/v3.1/languages`, {
          documents: [{
            id: '1',
            text: extractedText.substring(0, 5120) // Limit text for detection
          }]
        }, {
          headers: {
            'Ocp-Apim-Subscription-Key': languageKey,
            'Content-Type': 'application/json',
          },
        });

        detectedLanguage = detectResponse.data.documents[0].detectedLanguage.iso6391Name;
      } catch (detectError) {
        console.warn('Language detection failed, using default English:', (detectError as Error).message);
      }
    }

    // Prepare text for translation (truncate if too long)
    let textToTranslate = extractedText;
    if (extractedText.length > 5000) {
      textToTranslate = extractedText.substring(0, 5000);
    }

    // Step 3: Translate the text using Azure AI Translator
    if (!translatorKey || !translatorEndpoint) {
      return NextResponse.json({ error: 'Azure Translator service not configured.' }, { status: 500 });
    }

    const translateResponse = await axios.post(`${translatorEndpoint}/translate?api-version=3.0&from=${detectedLanguage}&to=${targetLanguage}`, [{
      text: textToTranslate,
    }], {
      headers: {
        'Ocp-Apim-Subscription-Key': translatorKey,
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Region': process.env.AZURE_TRANSLATOR_REGION || 'eastus'
      },
    });

    const translatedText = translateResponse.data[0].translations[0].text;

    const response: TranslationResponse = {
      originalText: extractedText,
      translatedText,
      detectedLanguage,
      targetLanguage
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Translation API Error:', (error as Error).message);
    return NextResponse.json({
      error: 'Failed to translate text.',
      details: (error as Error).message
    }, { status: 500 });
  }
}