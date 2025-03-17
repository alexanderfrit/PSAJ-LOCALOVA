import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { clearCart } from "../redux/slice/cartSlice";
import { store } from "../redux/store";
import { toast } from "react-toastify";
import { toastConfig } from "./toastConfig";

export const saveOrder = async (paymentResult) => {
  console.log("saveOrder called with result:", paymentResult);
  const { auth, cart, checkout } = store.getState();
  const { email, userId } = auth;
  const { cartItems, totalAmount } = cart;
  const { shippingAddress } = checkout;

  const date = new Date().toDateString();
  const time = new Date().toLocaleTimeString();

  const orderDetails = {
    userId,
    userEmail: email,
    email: email,
    orderDate: date,
    orderTime: time,
    orderAmount: totalAmount,
    orderStatus: paymentResult.status === "pending" ? "Pending" : "Order Placed",
    cartItems,
    shippingAddress,
    paymentResult,
    createdAt: Timestamp.now().toDate(),
  };

  try {
    console.log("Saving order to Firestore:", orderDetails);
    await addDoc(collection(db, "orders"), orderDetails);
    store.dispatch(clearCart());
    console.log("Order saved successfully");
    if (paymentResult.status !== "pending") {
      toast.success("Payment successful!", toastConfig.success);
    }
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
}; 