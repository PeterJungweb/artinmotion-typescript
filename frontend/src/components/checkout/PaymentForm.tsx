import React, {useState} from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "../../hooks/useCart";

interface CustomerInfo {
    email: string;
    name: string;
}

export function PaymentForm() {
    const stripe = useStripe();
    const elements = useElements();
    const {cartTotals, clearCart} = useCart();
    const [loading, setLoading] = useState(false);
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        email: "",
        name:""
    });

    const handleSubmit() = async (event: React.FormEvent) => {
        event.preventDefault();
        if(!stripe || !elements) return;

        setLoading(true);

        try {
            const response = await 
        } catch (error) {
            
        }
    }

}