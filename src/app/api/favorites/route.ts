import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

// GET - Ottenere i preferiti dell'utente
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID è richiesto' },
        { status: 400 }
      );
    }

    const favorites = await db.getUserFavorites(userId);
    const gameIds = favorites.map((fav: any) => fav.game_id);

    return NextResponse.json({
      success: true,
      favorites: gameIds
    });

  } catch (error) {
    console.error('Errore nel recupero dei preferiti:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// POST - Aggiungere un gioco ai preferiti
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, gameId } = body;

    if (!userId || !gameId) {
      return NextResponse.json(
        { error: 'User ID e Game ID sono richiesti' },
        { status: 400 }
      );
    }

    const result = await db.addGameToFavorites(userId, gameId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Gioco aggiunto ai preferiti',
      favorite: result.favorite
    });

  } catch (error) {
    console.error('Errore nell\'aggiunta ai preferiti:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// DELETE - Rimuovere un gioco dai preferiti
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const gameId = searchParams.get('gameId');

    if (!userId || !gameId) {
      return NextResponse.json(
        { error: 'User ID e Game ID sono richiesti' },
        { status: 400 }
      );
    }

    const result = await db.removeGameFromFavorites(userId, gameId);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Preferito non trovato' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Gioco rimosso dai preferiti'
    });

  } catch (error) {
    console.error('Errore nella rimozione dai preferiti:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}