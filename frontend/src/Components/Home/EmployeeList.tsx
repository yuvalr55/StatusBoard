import React from "react";
import {List, ListItem, ListItemText} from "@mui/material";
import  {Employee} from '../../Typing'


const EmployeeList: React.FC<{
    employees: Employee[];
}> = ({employees}) => {


    return (
        <List sx={{mt: 2, border: "1px solid #ccc"}}>
            {employees.map((emp) => (
                <ListItem
                    key={emp.username}
                    sx={{
                        backgroundColor: emp.status === "On Vacation" ? "#eee" : "inherit",
                    }}
                >
                    <ListItemText primary={`${emp.username} (${emp.status})`}/>
                </ListItem>
            ))}
        </List>
    );
};

export default EmployeeList;