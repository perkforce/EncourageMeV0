import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { thought } = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a compassionate friend providing encouragement. You are talking to Albert",
        },
        {
          role: "user",
          content: thought,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    return NextResponse.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate encouragement' },
      { status: 500 }
    );
  }
}