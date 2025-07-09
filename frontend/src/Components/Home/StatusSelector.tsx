import React from "react";
import {FormControl, MenuItem, Select, Typography} from "@mui/material";
import {updateStatus, fetchMyStatus} from "../../Services/status";

const StatusSelector: React.FC<{
    status: string;
    setUser: (user: { username: string; status: string }) => void;
    statuses: string[];
}> = ({status, setUser, statuses}) => {

    return (
        <>
            <Typography variant="subtitle1">Update My Current Status:</Typography>
            <FormControl fullWidth sx={{mt: 1}}>
                <Select
                    value={status}
                    onChange={async (e) => {
                        const newStatus = e.target.value as string;
                        try {
                            const updateResponse = await updateStatus(newStatus);
                            if (updateResponse) {
                                const userResponse = await fetchMyStatus();
                                if (userResponse) setUser(userResponse);
                            }
                        } catch (err) {
                            console.error("Failed to update status:", err);
                        }
                    }}
                >
                    {statuses.map((s) => (
                        <MenuItem key={s} value={s}>
                            {s}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
};

export default StatusSelector;