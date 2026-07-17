import { NextRequest, NextResponse } from 'next/server';

const READ_ONLY_URL = process.env.READ_ONLY_URL;
const READ_ONLY_SERVICE_KEY = process.env.READ_ONLY_SERVICE_KEY;

export async function POST(req: NextRequest) {
  if (!READ_ONLY_URL || !READ_ONLY_SERVICE_KEY) {
    return NextResponse.json(
      { error: 'Configuration manquante' },
      { status: 500 }
    );
  }

  try {
    const { movieId, customerEmail } = await req.json();

    if (!movieId || !customerEmail) {
      return NextResponse.json(
        { error: 'movieId et customerEmail requis' },
        { status: 400 }
      );
    }

    const response = await fetch(`${READ_ONLY_URL}/api/secure-playback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${READ_ONLY_SERVICE_KEY}`,
      },
      body: JSON.stringify({ movieId, customerEmail }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Rental API error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
