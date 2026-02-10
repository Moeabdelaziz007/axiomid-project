/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateTier } from '@/lib/tiers';
import { ACTIONS } from '@/lib/actions';

export async function POST(request: Request) {
  try {
    const { walletAddress, actionType } = await request.json();

    if (!walletAddress || !actionType) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const actionDef = Object.values(ACTIONS).find(a => a.id === actionType);

    if (!actionDef) {
      return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: { actions: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if action already performed (unless it's repeatable like daily)
    // explicitly typing 'a' as any to avoid build errors if Action type is not generated
    if (actionType !== 'daily_pow' && user.actions.some((a: any) => a.type === actionType)) {
      return NextResponse.json({ error: 'Action already claimed' }, { status: 400 });
    }

    // Check daily pow cooldown (simulated for MVP)
    if (actionType === 'daily_pow') {
        const lastDaily = user.actions
            .filter((a: any) => a.type === 'daily_pow')
            .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

        if (lastDaily) {
            const diff = Date.now() - new Date(lastDaily.timestamp).getTime();
            if (diff < 24 * 60 * 60 * 1000) {
                 return NextResponse.json({ error: 'Daily claim cooldown' }, { status: 400 });
            }
        }
    }

    // Create Action
    await prisma.action.create({
      data: {
        userId: user.id,
        type: actionType,
        xp: actionDef.xp,
      },
    });

    // Update User XP & Tier
    const newXP = user.xp + actionDef.xp;
    const newTier = calculateTier(newXP);

    const updatedUser = await prisma.user.update({
      where: { walletAddress },
      data: {
        xp: newXP,
        tier: newTier,
      },
    });

    return NextResponse.json({ user: updatedUser, earned: actionDef.xp });
  } catch (error) {
    console.error('Error claiming action:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
