"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import apis from "@/services/apis";
import { Match, Team } from "@/types";
import Label from "@/ui/label";
import Input from "@/ui/input";
import Button from "@/ui/button";
import Select from "@/ui/select";

// Define constant choices outside the component to prevent re-creation
const TOSS_DECISION_CHOICES = [
    { value: "BAT", name: "Bat" },
    { value: "BOWL", name: "Bowl" },
];

// Helper to format team data for the Select component
const formatTeamAsChoice = (team: Team) => ({
    value: team.teamId,
    name: team.name,
});

interface MatchFormProps {
    heading?: string;
    match?: Match | null;
}

const MatchForm: React.FC<MatchFormProps> = ({
    match,
    heading = "Add New Match",
}) => {
    const router = useRouter();
    const [allTeams, setAllTeams] = useState<{ value: number; name: string }[]>(
        []
    );
    const [formData, setFormData] = useState(() => ({
        teamA: match?.teams[0]?.teamId || "",
        teamB: match?.teams[1]?.teamId || "",
        tossWinner: match?.toss?.winner.teamId || "",
        tossDecision: match?.toss?.decision || "BAT",
    }));
    const [message, setMessage] = useState("");

    // Fetch all teams once when the component mounts
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const teams: Team[] = await apis.teams.list();
                const teamChoices = teams.map(formatTeamAsChoice);
                setAllTeams(teamChoices);

                // If creating a new match, set default teams
                if (!match && teamChoices.length >= 2) {
                    setFormData({
                        teamA: teamChoices[0].value,
                        teamB: teamChoices[1].value,
                        tossWinner: teamChoices[0].value,
                        tossDecision: "BAT",
                    });
                }
            } catch (error) {
                setMessage("Failed to load teams.");
            }
        };
        fetchTeams();
    }, [match]);

    const tossWinnerChoices = useMemo(() => {
        formData.tossWinner = formData.teamA;
        return allTeams.filter(
            (team) =>
                team.value == formData.teamA || team.value == formData.teamB
        );
    }, [formData, allTeams]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.teamA === formData.teamB) {
            setMessage("Team A and Team B cannot be the same.");
            return;
        }
        setMessage("");

        try {
            const payload = {
                teams: [Number(formData.teamA), Number(formData.teamB)],
                toss: {
                    winner: Number(formData.tossWinner),
                    decision: formData.tossDecision,
                },
            };

            const result: Match = await apis.matches.startMatch(payload);

            setMessage("Match saved successfully!");
            router.push(`/admin/matches/${result.matchId}`);
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h2>{heading}</h2>
            <div className="formGroup">
                <Label htmlFor="teamA">Team A</Label>
                <Select
                    id="teamA"
                    name="teamA"
                    value={formData.teamA}
                    onChange={handleChange}
                    choices={allTeams.filter(
                        (team) => team.value !== formData.teamB
                    )}
                />
            </div>
            <div className="formGroup">
                <Label htmlFor="teamB">Team B</Label>
                <Select
                    id="teamB"
                    name="teamB"
                    value={formData.teamB}
                    onChange={handleChange}
                    choices={allTeams.filter(
                        (team) => team.value !== formData.teamA
                    )}
                />
            </div>
            <div className="formGroup">
                <Label htmlFor="tossWinner">Toss Winner</Label>
                <Select
                    id="tossWinner"
                    name="tossWinner"
                    value={formData.tossWinner}
                    onChange={handleChange}
                    choices={tossWinnerChoices}
                />
            </div>
            <div className="formGroup">
                <Label htmlFor="tossDecision">Toss Decision</Label>
                <Select
                    id="tossDecision"
                    name="tossDecision"
                    value={formData.tossDecision}
                    onChange={handleChange}
                    choices={TOSS_DECISION_CHOICES}
                />
            </div>
            <Button type="submit">
                {match ? "Update Match" : "Add Match"}
            </Button>
            {message && <p className="message">{message}</p>}
        </form>
    );
};

export default MatchForm;
