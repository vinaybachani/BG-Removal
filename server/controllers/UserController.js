import { Webhook } from 'svix';
import userModel from '../models/userModal.js';

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verify webhook
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });
        console.log("Webhook verified successfully.");

        const { data, type } = req.body;
        console.log(data);

        switch (type) {
            case "user.created":
                const createdUserData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                };
                await userModel.create(createdUserData);
                res.status(201).json({ success: true });
                break;

            case "user.updated":
                const updatedUserData = {
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                };
                await userModel.findOneAndUpdate({ clerkId: data.id }, updatedUserData);
                res.status(200).json({ success: true });
                break;

            case "user.deleted":
                await userModel.findOneAndDelete({ clerkId: data.id });
                res.status(204).json({ success: true });
                break;

            default:
                res.status(400).json({ success: false, message: "Invalid webhook type" });
        }
    } catch (error) {
        console.error("Error handling webhook:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}


const userCredits = async (req, res) => {
    try {
        const { clerkId } = req.body;
        const userData = await userModel.findOne({ clerkId });
        res.json({ success: true, credits: userData.credit })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export { clerkWebhooks, userCredits };