import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'
import { auth } from '@/lib/auth'

type Params = Promise<{ id: string }>

export const GET = auth(async (req: any, props: { params: Params }) => {
  const params = await props.params
  const { id } = params

  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  await dbConnect()
  const order = await OrderModel.findById(id)
  return Response.json(order)
}) as any
