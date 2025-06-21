import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/shared/prisma';

// GET /api/contributions?campaignId=xyz
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const campaignId = searchParams.get('campaignId');

  if (!campaignId) {
    return NextResponse.json(
      { message: 'Campaign ID is required' },
      { status: 400 }
    );
  }

  try {
    // Get all contributions for a campaign
    const contributions = await prisma.contribution.findMany({
      where: {
        campaignId: campaignId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate total amount contributed
    const totalAmount = await prisma.contribution.aggregate({
      where: {
        campaignId: campaignId,
      },
      _sum: {
        amount: true,
      },
    });

    // Count number of contributors
    const uniqueContributors = await prisma.contribution.groupBy({
      by: ['userId'],
      where: {
        campaignId: campaignId,
      },
    });

    return NextResponse.json({
      contributions,
      stats: {
        totalAmount: totalAmount._sum.amount || 0,
        contributorsCount: uniqueContributors.length,
      },
    });
  } catch (error) {
    console.error('Failed to fetch contributions:', error);
    return NextResponse.json(
      { message: 'Failed to fetch contributions' },
      { status: 500 }
    );
  }
}

// POST /api/contributions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { amount, campaignId } = body;
    if (!amount || !campaignId) {
      return NextResponse.json(
        { message: 'Amount and campaignId are required' },
        { status: 400 }
      );
    }

    // Create the contribution
    // Note: In a real app, userId would come from an auth token
    // For now, we'll use a placeholder or anonymous contribution
    const contribution = await prisma.contribution.create({
      data: {
        amount: body.amount,
        message: body.message || '',
        anonymous: body.anonymous || false,
        campaign: {
          connect: {
            id: campaignId,
          },
        },
        // If authenticated, you would add user connection:
        // user: { connect: { id: userId } },
      },
    });

    return NextResponse.json(contribution, { status: 201 });
  } catch (error) {
    console.error('Failed to create contribution:', error);
    return NextResponse.json(
      { message: 'Failed to create contribution' },
      { status: 500 }
    );
  }
}
