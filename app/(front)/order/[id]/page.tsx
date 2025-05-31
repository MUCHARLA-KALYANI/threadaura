import OrderDetails from './OrderDetails'


export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return {
    title: `Order ${params.id}`,
  }
}


export default async function OrderHistory(
  props: {
    params: Promise<{ id: string }>
  }
) {
  const params = await props.params;
  return (
    <OrderDetails
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      orderId={params.id}
    />
  )
}