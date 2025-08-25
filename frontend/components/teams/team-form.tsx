"use client";

import React, { useState } from "react";
import apis from "@/services/apis";
import Input from "@/ui/input";
import Label from "@/ui/label";
import Button from "@/ui/button";
import { useRouter } from "next/navigation";
import { Team } from "@/types";

interface TeamFormProps {
    heading?: string;
    team?: Team | null;
}

const TeamForm: React.FC<TeamFormProps> = ({ team, heading = "Add new team" }) => {
    const initialFormData = team || {
        name: "",
        short_name: "",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [message, setMessage] = useState("");

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            const result = await apis.teams.createOrUpdate({id: team?.teamId, formData});
            setMessage(`Team saved successfully! Team ID: ${result.teamId}`);
            setFormData({ name: "", short_name: "" });
            router.push("/admin/teams");
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h2>{heading}</h2>
            <div className="formGroup">
                <Label htmlFor="name">Team Name</Label>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="formGroup">
                <Label htmlFor="short_name">Short Name</Label>
                <Input
                    type="text"
                    id="short_name"
                    name="short_name"
                    value={formData.short_name}
                    onChange={handleChange}
                    required
                />
            </div>
            <Button type="submit">Add Team</Button>
            {message && <p className="message">{message}</p>}
        </form>
    );
};

export default TeamForm;
