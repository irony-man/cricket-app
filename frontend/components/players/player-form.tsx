"use client";

import { useState } from "react";
import apis from "@/services/apis";
import Input from "@/ui/input";
import Label from "@/ui/label";
import Button from "@/ui/button";
import { useRouter } from "next/navigation";
import { Player } from "@/types";
import Select from "@/ui/select";

interface PlayerFormProps {
    heading?: string;
    player?: Player | null;
}

const PlayerForm: React.FC<PlayerFormProps> = ({
    player,
    heading = "Add new player",
}) => {
    const teamIds = player?.teams?.map((team) => team.teamId) || [];
    const initialFormData = player
        ? { ...player, teams: teamIds.join(",") }
        : {
              name: "",
              short_name: "",
              role: "BATSMAN",
              teams: "",
          };

    const [formData, setFormData] = useState(initialFormData);
    const [message, setMessage] = useState("");

    const router = useRouter();

    const playerRoles = [
        { value: "BATSMAN", name: "Batsman" },
        { value: "BOWLER", name: "Bowler" },
        { value: "ALL_ROUNDER", name: "All-Rounder" },
        { value: "WICKET_KEEPER", name: "Wicket-Keeper" },
    ];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            await apis.players.createOrUpdate({
                id: player?.playerId,
                formData: {
                    ...formData,
                    teams: formData.teams
                        .split(",")
                        .map((id) => parseInt(id.trim()))
                        .filter((id) => !isNaN(id)),
                },
            });
            setMessage(`Player saved successfully!`);
            setFormData(initialFormData);
            router.push("/admin/players");
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h2>{heading}</h2>
            <div className="formGroup">
                <Label htmlFor="name">Player Name</Label>
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
            <div className="formGroup">
                <Label htmlFor="role">Role</Label>
                <Select
                    id="role"
                    name="role"
                    value={formData.role}
                    choices={playerRoles}
                    onChange={handleChange}
                />
            </div>
            <div className="formGroup">
                <Label htmlFor="teams">Team IDs (comma-separated)</Label>
                <Input
                    type="text"
                    id="teams"
                    name="teams"
                    value={formData.teams}
                    onChange={handleChange}
                    placeholder="e.g., 1001, 1002"
                />
            </div>
            <Button type="submit">Add Player</Button>
            {message && <p className="message">{message}</p>}
        </form>
    );
};

export default PlayerForm;
