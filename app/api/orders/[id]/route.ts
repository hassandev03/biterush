import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    await dbConnect();
    const resolvedParams = await params;
    const order = await Order.findById(resolvedParams.id).populate('items.product', 'name image price');

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    if (payload.role !== 'admin' && order.customer.toString() !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    if (payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await dbConnect();
    const { status } = await req.json();

    const validStatuses = ['pending', 'confirmed', 'delivered'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const resolvedParams = await params;

    // Fetch current order to check existing status
    const existing = await Order.findById(resolvedParams.id);
    if (!existing) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    if (existing.status === 'delivered') {
      return NextResponse.json({ error: 'Delivered orders cannot be modified' }, { status: 409 });
    }

    const order = await Order.findByIdAndUpdate(
      resolvedParams.id,
      { status },
      { new: true }
    ).populate('customer', 'name email').populate('items.product', 'name');

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
