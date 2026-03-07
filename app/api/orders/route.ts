import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    
    await dbConnect();
    const { items, totalAmount } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order items are required' }, { status: 400 });
    }

    const order = await Order.create({
      customer: payload.userId,
      items,
      totalAmount,
      status: 'pending'
    });
    
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    await dbConnect();

    let orders;
    if (payload.role === 'admin') {
      orders = await Order.find({}).populate('customer', 'name email').populate('items.product', 'name').sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ customer: payload.userId }).populate('items.product', 'name').sort({ createdAt: -1 });
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
