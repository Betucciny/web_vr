// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {getEntries, setEntry} from "@/server_services/database";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const data = await getEntries()
            res.status(200).json({status: "success", data: data});
        } catch (e) {
            res.status(500).json({status: "error", data: e.message});
        }
    } else if (req.method === 'POST') {
        const {text} = req.body
        try {
            await setEntry(text)
            res.status(200).json({status: "success"});
        } catch (e) {
            res.status(500).json({status: "error", data: e.message});
        }
    } else {
        res.status(405).json({status: "error", data: "Method not allowed"});
    }
}
