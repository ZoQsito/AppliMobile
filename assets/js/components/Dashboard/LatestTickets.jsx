import React from "react";
import { format } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  Stack,
  Typography,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { SeverityPill } from "./severity-pill";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";


const statusMap = {
  Traitement: "warning",
  Ouvert: "primary",
  Ferme: "success",
};

export const LatestTickets = (props) => {
  const { tickets = [], sx } = props;
  const { isAdmin, setIsAuthenticated, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);

      return format(date, "dd/MM/yyyy");
    }
  };

  const handleViewAll = () => {
    navigate("/ticket")
  }

  return (
    <Card sx={sx}>
      <CardHeader title="Derniers Tickets" />
      <Box sx={{ minWidth: 800, textAlign: "center" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{textAlign: "center" }}>Application</TableCell>
              <TableCell style={{textAlign: "center" }}>Agent</TableCell>
              <TableCell style={{textAlign: "center" }} sortDirection="desc">Date_Creation</TableCell>
              <TableCell style={{textAlign: "center" }}>Date_Cloture</TableCell>
              <TableCell style={{textAlign: "center" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.slice(-5).reverse().map((ticket) => {
              return (
                <TableRow hover key={ticket.id}>
                  <TableCell style={{textAlign: "center" }}>
                    <Stack>
                      <Typography variant="subtitle2" >
                        {ticket?.app?.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell style={{textAlign: "center" }}>{ticket?.userId?.username}</TableCell>
                  <TableCell style={{textAlign: "center" }} sortDirection="desc">{formatDate(ticket.dateStart)}</TableCell>
                  <TableCell style={{textAlign: "center" }}>{formatDate(ticket.dateEnd)}</TableCell>
                  <TableCell style={{textAlign: "center" }}>
                    <SeverityPill color={statusMap[ticket?.etat?.name]}>
                      {ticket?.etat?.name.toUpperCase()}
                    </SeverityPill>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      {isAdmin && (
        <>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
              color="inherit"
              endIcon={
                <SvgIcon fontSize="small">
                  <ArrowRightIcon />
                </SvgIcon>
              }
              size="small"
              variant="text"
              onClick={() => handleViewAll()}
            >
              Voir Tous
            </Button>
          </CardActions>
        </>
      )}
    </Card>
  );
};

LatestTickets.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object,
};
