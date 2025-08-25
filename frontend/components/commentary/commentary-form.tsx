"use client";

import React, { useState, useMemo } from "react";
import apis from "@/services/apis";
import { Match, Player } from "@/types";
import Label from "@/ui/label";
import Input from "@/ui/input";
import Button from "@/ui/button";
import Select from "@/ui/select";

const toPlayerOption = (player: Player) => ({
    value: player.playerId,
    name: player.name,
});

interface CommentaryFormProp {
    match: Match;
}

const CommentaryForm: React.FC<CommentaryFormProp> = ({ match }) => {
    const getInitialState = () => ({
        team: match.toss.winner?.teamId.toString() || "",
        striker: "",
        non_striker: "",
        bowler: "",
        inning: "1",
        over: "",
        ball: "",
        eventType: "",
    });

    const [formData, setFormData] = useState(getInitialState());
    const [message, setMessage] = useState("");

    const { battingPlayers, bowlingPlayers } = useMemo(() => {
        const selectedTeamId = parseInt(formData.team);
        const battingTeam = match.teams.find(
            (team) => team.teamId === selectedTeamId
        );
        const bowlingTeam = match.teams.find(
            (team) => team.teamId !== selectedTeamId
        );

        const battingPlayers = battingTeam?.players?.map(toPlayerOption) || [];
        const bowlingPlayers = bowlingTeam?.players?.map(toPlayerOption) || [];

        setFormData((prev) => ({
            ...prev,
            striker: String(battingPlayers[0]?.value || ""),
            non_striker: String(battingPlayers[1]?.value || ""),
            bowler: String(bowlingPlayers[0]?.value || ""),
        }));

        return {
            battingPlayers,
            bowlingPlayers,
        };
    }, [formData.team, match.teams]);

    const teamChoices = useMemo(
        () =>
            match.teams.map((team) => ({
                value: team.teamId,
                name: team.name,
            })),
        [match.teams]
    );

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const payload = {
            team: parseInt(formData.team),
            striker: parseInt(formData.striker),
            non_striker: parseInt(formData.non_striker),
            bowler: parseInt(formData.bowler),
            inning: parseInt(formData.inning),
            over: parseInt(formData.over),
            ball: parseInt(formData.ball),
            eventType: formData.eventType,
        };

        try {
            await apis.matches.createNested(
                match.matchId,
                "commentary",
                payload
            );
            setMessage(`Commentary added successfully!`);
            setFormData((prev) => {
                return {
                    ...getInitialState(),
                    ...prev,
                    ball: String(parseInt(prev.ball) + 1),
                };
            });
        } catch (error) {
            setMessage(
                `Error: ${error?.message || "An unknown error occurred"}`
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form commentaryForm">
            <div className="formGroup">
                <Label htmlFor="team">Batting Team</Label>
                <Select
                    id="team"
                    name="team"
                    value={formData.team}
                    onChange={handleChange}
                    choices={teamChoices}
                    required
                />
            </div>
            <div className="formGroup">
                <Label htmlFor="striker">Striker</Label>
                <Select
                    id="striker"
                    name="striker"
                    value={formData.striker}
                    onChange={handleChange}
                    choices={battingPlayers}
                    required
                />
            </div>
            <div className="formGroup">
                <Label htmlFor="non_striker">Non-Striker</Label>
                <Select
                    id="non_striker"
                    name="non_striker"
                    value={formData.non_striker}
                    onChange={handleChange}
                    choices={battingPlayers}
                    required
                />
            </div>
            <div className="formGroup">
                <Label htmlFor="bowler">Bowler</Label>
                <Select
                    id="bowler"
                    name="bowler"
                    value={formData.bowler}
                    onChange={handleChange}
                    choices={bowlingPlayers}
                    required
                />
            </div>
            <div className="formGroup">
                <Label htmlFor="inning">Inning</Label>
                <Input
                    type="number"
                    id="inning"
                    name="inning"
                    value={formData.inning}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="formGroup">
                <Label htmlFor="over">Over</Label>
                <Input
                    type="number"
                    id="over"
                    name="over"
                    value={formData.over}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="formGroup">
                <Label htmlFor="ball">Ball</Label>
                <Input
                    type="number"
                    id="ball"
                    name="ball"
                    value={formData.ball}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="formGroup">
                <Label htmlFor="eventType">Event</Label>
                <Input
                    type="text"
                    id="eventType"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
                <Button type="submit">Add Commentary</Button>
                {message && <p className="message">{message}</p>}
            </div>
        </form>
    );
};

export default CommentaryForm;
