import React, {useState, useCallback, useEffect, useMemo, useRef} from "react";
import isEqual from "lodash/isEqual";
import {Box, Container, Typography} from "@mui/material";
import {fetchStatuses, fetchMyStatus} from "../../Services/status";
import StatusSelector from './StatusSelector'
import SearchAndFilter from './SearchAndFilter'
import EmployeeList from './EmployeeList'
import  {Employee} from '../../Typing'



const statuses = ["Working", "Working Remotely", "On Vacation", "Business Trip"];

const HomePage: React.FC = () => {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [user, setUser] = useState<{ username: string; status: string } | null>(null);

    const filteredEmployees = useMemo(() => {
        return [...employees]
            .filter(e => e.username)
            .sort((a, b) => a.username.localeCompare(b.username))
            .filter(emp => {
                const matchesName = emp.username.toLowerCase().includes(search.toLowerCase());
                const matchesStatus = filterStatus.length > 0 ? filterStatus.includes(emp.status) : true;
                return matchesName && matchesStatus;
            });
    }, [employees, search, filterStatus]);

    const loadMyStatus = useCallback(async () => {
        try {
            const data = await fetchMyStatus();
            setUser(data);
        } catch (err) {
            console.error("Failed to fetch my status:", err);
        }
    }, []);

    useEffect(() => {
        loadMyStatus();
    }, [loadMyStatus]);

    const prevDataRef = useRef<Employee[]>([]);

    useEffect(() => {
        const fetchAndCompare = async () => {
            try {
                const newData = await fetchStatuses(filterStatus);
                const prevData = prevDataRef.current;

                const statusesChanged = !isEqual(
                    prevData.map((e) => e.status),
                    newData.map((e: { status: string; }) => e.status)
                );
                const lengthChanged = prevData.length !== newData.length;

                if (statusesChanged || lengthChanged) {
                    setEmployees(newData);
                    prevDataRef.current = newData;
                }
            } catch (err) {
                console.error("Failed to fetch statuses:", err);
            }
        };

        fetchAndCompare(); // initial call
        const interval = setInterval(fetchAndCompare, 10000); // 10 seconds

        return () => clearInterval(interval);
    }, [filterStatus]);

    return (
        <Container maxWidth={false} sx={{mt: 4, width: 800}}>
            <Typography variant="h6" gutterBottom>
                {user
                    ? `Hello M. ${user.username[0].toUpperCase()}${user.username.slice(1)}, you are ${user.status},`
                    : "Loading..."}
            </Typography>

            <Box mt={2}>
                <StatusSelector
                    status={user?.status || ""}
                    setUser={setUser}
                    statuses={statuses}
                />
            </Box>

            <Box mt={4}>
                <Typography variant="subtitle1">List of employees:</Typography>
                <SearchAndFilter {...{search, setSearch, filterStatus, setFilterStatus, statuses}} />
            </Box>

            <EmployeeList employees={filteredEmployees}/>
        </Container>
    );
};

export default HomePage;