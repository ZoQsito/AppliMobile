import React, { useState, useEffect } from "react";
import Field from "../components/Field";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AgentsAPI from "../services/AgentsAPI";
import {
  Box,
  FormControl,
  Modal,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  FormHelperText,
} from "@mui/material";
import usersAPI from "../services/usersAPI";
import ServiceAPI from "../services/ServiceAPI";
import RoleAPI from "../services/RoleAPI";

const AgentPage = ({}) => {
  const { id = "new" } = useParams();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [agentID, setAgentID] = useState();
  const [services, setServices] = useState([]);

  const [agentUpdate, setAgentUpdate] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    service: "",
    color: "",
    user: "",
  });

  const [agent, setAgent] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    service: "",
    color: "",
  });

  const [creationErrors, setCreationErrors] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    service: "",
    color: "",
  });

  const [updateErrors, setUpdateErrors] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    service: "",
    color: "",
  });

  const [User, setUser] = useState({
    username: "",
    email: "",
    role: "",
  });
  User.agent = `/api/agents/${agentID}`;

  const [role, setRole] = useState([]);

  const fetchAgent = async (id) => {
    try {
      const { prenom, nom, telephone, service, color, user } =
        await AgentsAPI.find(id);
      setAgentID(id);
      setAgentUpdate({
        prenom,
        nom,
        telephone,
        service: service["@id"],
        color,
        user,
      });
    } catch (error) {
      toast.error("L'agent n'a pas pu être chargé");
    }
  };

  const fetchService = async (id) => {
    try {
      const data = await ServiceAPI.findAll();
      setServices(data);
    } catch (error) {
      toast.error("Les Services n'ont pas été chargés");
    }
  };

  const fetchRole = async () => {
    try {
      const data = await RoleAPI.findAll();
      setRole(data);
    } catch (error) {
      toast.error("Les Roles n'ont pas été chargés");
    }
  };

  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchAgent(id);
      fetchRole();
    }
    fetchService();
  }, [id]);

  console.log(role)

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setAgent({ ...agent, [name]: value });
  };

  const handleChangeUpdate = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setAgentUpdate({ ...agentUpdate, [name]: value });
  };

  const phoneRegex = /^\d{10}$/;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!editing) {
        const validationErrors = {};
        if (!agent.nom) {
          validationErrors.nom = "Le nom est requis";
        }
        if (!agent.prenom) {
          validationErrors.prenom = "Le prénom est requis";
        }
        if (!agent.telephone) {
          validationErrors.telephone = "Le numéro de téléphone est requis";
        } else if (!phoneRegex.test(agent.telephone)) {
          validationErrors.telephone =
            "Le numéro de téléphone doit comporter 10 chiffres et ne doit contenir que des chiffres.";
        }
        if (!agent.service) {
          validationErrors.service = "Le service est requis";
        }
        if (!agent.color) {
          validationErrors.color = "La couleur est requise";
        }

        if (Object.keys(validationErrors).length > 0) {
          setCreationErrors(validationErrors);
          return;
        }

        await AgentsAPI.create(agent);
        toast.success("L'agent a bien été créé");
      } else {
        const validationErrors = {};
        if (!agentUpdate.nom) {
          validationErrors.nom = "Le nom est requis";
        }
        if (!agentUpdate.prenom) {
          validationErrors.prenom = "Le prénom est requis";
        }
        if (!agentUpdate.telephone) {
          validationErrors.telephone = "Le numéro de téléphone est requis";
        } else if (!phoneRegex.test(agentUpdate.telephone)) {
          validationErrors.telephone =
            "Le numéro de téléphone doit comporter 10 chiffres et ne doit contenir que des chiffres.";
        }
        if (!agentUpdate.service) {
          validationErrors.service = "Le service est requis";
        }
        if (!agentUpdate.color) {
          validationErrors.color = "La couleur est requise";
        }

        if (Object.keys(validationErrors).length > 0) {
          setUpdateErrors(validationErrors);
          return;
        }

        await AgentsAPI.update(id, agentUpdate);
        toast.success("L'agent a bien été modifié");
      }

      navigate("/agents");
    } catch ({ error }) {
      toast.error("L'agent n'a pas pu être créé/modifié");
    }
  };

  const [open, setOpen] = useState(false);

  const handleChangeModal = ({ currentTarget }) => {
    const { name, value } = currentTarget;

    if (name === "roles") {
      const rolesArray = value.split(",").map((role) => role.trim());
      setUser({ ...User, [name]: rolesArray });
    } else {
      setUser({ ...User, [name]: value });
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async (event) => {
    event.preventDefault();

    if (User.role.length === 0) {
      User.role = [];
    }

    await usersAPI.registerAgentUser(agentID, User);

    toast.success("Le user a bien été créé");

    navigate("/users");

    handleClose();
  };

  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;

    setAgent((prevAgent) => ({
      ...prevAgent,
      service: selectedValue,
    }));
  };

  const handleSelectionChangeUpdate = (event) => {
    const selectedValue = event.target.value;

    setAgentUpdate((prevAgent) => ({
      ...prevAgent,
      service: selectedValue,
    }));
  };

  const handleSelectionChangeRole = (event) => {
    const selectedValue = event.target.value;

    setUser((prevUser) => ({
      ...prevUser,
      role: selectedValue,
    }));
  };

  const modalBody = (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
      }}
    >
      <TextField
        name="username"
        label="Username"
        variant="filled"
        fullWidth
        value={User.username}
        onChange={handleChangeModal}
      />
      <TextField
        name="email"
        label="Adresse Email"
        variant="filled"
        fullWidth
        value={User.email}
        onChange={handleChangeModal}
        sx={{ mt: 2 }}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Roles</InputLabel>
        <Select
          name="role"
          value={User.role}
          onChange={handleSelectionChangeRole}
        >
          <MenuItem value="">Sélectionnez un role</MenuItem>
          {role.map((role, index) => (
            <MenuItem key={index} value={role["@id"]}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleConfirm} sx={{ mt: 2 }}>
        Confirmer
      </Button>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h1>{editing ? "Modification de l'Agent" : "Ajout d'un Agent"}</h1>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <TextField
          name="nom"
          label="Nom de famille"
          placeholder="Nom de famille de l'agent"
          value={editing ? agentUpdate.nom : agent.nom}
          onChange={editing ? handleChangeUpdate : handleChange}
          error={editing ? !!updateErrors.nom : !!creationErrors.nom}
          fullWidth
          margin="normal"
        />
        <FormHelperText error>
          {editing ? updateErrors.nom : creationErrors.nom}
        </FormHelperText>{" "}
        <TextField
          name="prenom"
          label="Prénom"
          placeholder="Prénom de l'agent"
          value={editing ? agentUpdate.prenom : agent.prenom}
          onChange={editing ? handleChangeUpdate : handleChange}
          error={editing ? !!updateErrors.prenom : !!creationErrors.prenom}
          fullWidth
          margin="normal"
        />
        <FormHelperText error>
          {editing ? updateErrors.prenom : creationErrors.prenom}
        </FormHelperText>{" "}
        <TextField
          name="telephone"
          label="Numero Téléphone"
          placeholder="Numero Téléphone de l'agent"
          value={editing ? agentUpdate.telephone : agent.telephone}
          onChange={editing ? handleChangeUpdate : handleChange}
          error={
            editing ? !!updateErrors.telephone : !!creationErrors.telephone
          }
          fullWidth
          margin="normal"
        />
        <FormHelperText error>
          {editing ? updateErrors.telephone : creationErrors.telephone}
        </FormHelperText>{" "}
        <FormControl fullWidth margin="normal">
          <InputLabel>Service</InputLabel>
          <Select
            name="service"
            value={editing ? agentUpdate.service : agent.service}
            onChange={
              editing ? handleSelectionChangeUpdate : handleSelectionChange
            }
          >
            <MenuItem value="">Sélectionnez un justificatif</MenuItem>
            {services.map((service, index) => (
              <MenuItem key={index} value={service["@id"]}>
                {service.name}
              </MenuItem>
            ))}
          </Select>
          {editing ? (
            <FormHelperText error={!!updateErrors.service}>
              {updateErrors.service}
            </FormHelperText>
          ) : (
            <FormHelperText error={!!creationErrors.service}>
              {creationErrors.service}
            </FormHelperText>
          )}
        </FormControl>
        <TextField
          name="color"
          label="Couleur de l'agent"
          placeholder="#FFFFFF"
          value={editing ? agentUpdate.color : agent.color}
          onChange={editing ? handleChangeUpdate : handleChange}
          error={editing ? !!updateErrors.color : !!creationErrors.color}
          fullWidth
          margin="normal"
        />
        <FormHelperText error>
          {editing ? updateErrors.color : creationErrors.color}
        </FormHelperText>{" "}
        {editing && agentUpdate.user === undefined && (
          <Box sx={{ marginTop: 2 }}>
            <Button variant="contained" onClick={handleOpen}>
              Créer User
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              {modalBody}
            </Modal>
          </Box>
        )}
        <Box sx={{ paddingTop: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            style={{ marginRight: 20 }}
          >
            Enregistrer
          </Button>
          <Link to="/agents" className="btn btn-link">
            <Button variant="contained" color="primary">
              Retour a la liste
            </Button>
          </Link>
        </Box>
      </form>
    </Box>
  );
};

export default AgentPage;
