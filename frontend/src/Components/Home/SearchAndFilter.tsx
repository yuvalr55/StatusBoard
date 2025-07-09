import React from "react";
import {Box, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";


const SearchAndFilter: React.FC<{
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    filterStatus: string[];
    setFilterStatus: React.Dispatch<React.SetStateAction<string[]>>;
    statuses : string[]
}> = ({search, setSearch, filterStatus, setFilterStatus, statuses}) => {


    return (
        <Box display="flex" gap={2} mt={1}>
            <TextField
                placeholder="Search by name..."
                variant="outlined"
                size="small"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <FormControl size="small" sx={{minWidth: 250}}>
                <InputLabel>Filter By Status...</InputLabel>
                <Select
                    multiple
                    value={filterStatus}
                    onChange={(e) => {
                        const value = e.target.value;
                        setFilterStatus(typeof value === 'string' ? value.split(',') : value);
                    }}
                    label="Filter By Status..."
                    renderValue={(selected) => (selected as string[]).join(', ')}
                >
                    {statuses.map((status) => (
                        <MenuItem key={status} value={status}>
                            {status}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default SearchAndFilter;