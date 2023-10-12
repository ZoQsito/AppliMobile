import React, { useState, useEffect } from "react";
import Field from "../components/Field";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AgentsAPI from "../services/AgentsAPI";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import usersAPI from "../services/usersAPI";

const AgentPage = ({}) => {
  const { id = "new" } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [agentID, setAgentID] = useState();

  const [agentUpdate, setAgentUpdate] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    service: "",
    color: "",
  });


  const [agent, setAgent] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    service: "",
    color: "",
  });

  const [errors, setErrors] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    service: "",
  });

  const [User, setUser] = useState({
    username: "",
    email: "",
    role: [],
  });
  User.agent=`/api/agents/${agentID}`

  const fetchAgent = async (id) => {
    try {
      const { prenom, nom, telephone, service, color } = await AgentsAPI.find(
        id
      );
      setAgentID(id)
      setAgentUpdate({ prenom, nom, telephone, service, color });
    } catch (error) {
      toast.error("L'agent n'a pas pu être chargé");
    }
  };

  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchAgent(id);
    }
  }, [id]);

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setAgent({ ...agent, [name]: value });
  };

  const handleChangeUpdate = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setAgentUpdate({ ...agentUpdate, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setErrors({});

      if (editing) {
        await AgentsAPI.update(id, agent);
        toast.success("L'agent a bien été modifié");
        navigate("/agents");
      } else {
        await AgentsAPI.create(agent);
        toast.success("L'agent a bien été crée");
        navigate("/agents");
      }
    } catch ({ error }) {
      toast.error("L'agent n'a pas pu être créer");
    }
  };

  const [open, setOpen] = useState(false);

  const handleChangeModal = ({ currentTarget }) => {
    const { name, value } = currentTarget;

    if (name === "role") {
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

    await usersAPI.registerAgentUser(agentID ,User);
    
    toast.success("Le user a bien été créé");
    
    
    navigate("/users");

    handleClose();
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
      <TextField
        name="role"
        label="Rôle"
        variant="filled"
        fullWidth
        value={User.role}
        onChange={handleChangeModal}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" onClick={handleConfirm} sx={{ mt: 2 }}>
        Confirmer
      </Button>
    </Box>
  );

  return (
    <>
      {!editing ? (
        <>
          <h1>Ajout d'un Agent</h1>
          <form onSubmit={handleSubmit}>
            <Field
              name="nom"
              label="Nom de famille"
              placeholder="Nom de famille de l'agent"
              value={agent.nom}
              onChange={handleChange}
              error={errors.nom}
            />
            &nbsp;
            <Field
              name="prenom"
              label="Prénom"
              placeholder="Prénom de l'agent"
              value={agent.prenom}
              onChange={handleChange}
              error={errors.prenom}
            />
            &nbsp;
            <Field
              name="telephone"
              label="Numero Téléphone"
              placeholder="Numero Téléphone de l'agent"
              value={agent.telephone}
              onChange={handleChange}
              error={errors.telephone}
            />
            &nbsp;
            <Field
              name="service"
              label="Service"
              placeholder="Service de l'agent"
              value={agent.service}
              onChange={handleChange}
              error={errors.service}
            />
            &nbsp;
            <Field
              name="color"
              label="Couleur de l'agent"
              placeholder="#FFFFFF"
              value={agent.color}
              onChange={handleChange}
            />
            &nbsp;
            <div className="form-group">
              <Link
                to="/agents"
                className="btn btn-success"
                onClick={handleSubmit}
              >
                Enregistrer
              </Link>
              <Link to="/agents" className="btn btn-link">
                Retour à la liste
              </Link>
            </div>
          </form>
        </>
      ) : (
        <>
          <h1>Modification d'un Agent</h1>
          <form onSubmit={handleSubmit}>
            <Field
              name="nom"
              label="Nom de famille"
              placeholder="Nom de famille de l'agent"
              value={agentUpdate.nom}
              onChange={handleChangeUpdate}
              error={errors.nom}
            />
            &nbsp;
            <Field
              name="prenom"
              label="Prénom"
              placeholder="Prénom de l'agent"
              value={agentUpdate.prenom}
              onChange={handleChangeUpdate}
              error={errors.prenom}
            />
            &nbsp;
            <Field
              name="telephone"
              label="Numero Téléphone"
              placeholder="Numero Téléphone de l'agent"
              value={agentUpdate.telephone}
              onChange={handleChangeUpdate}
              error={errors.telephone}
            />
            &nbsp;
            <Field
              name="service"
              label="Service"
              placeholder="Service de l'agent"
              value={agentUpdate.service}
              onChange={handleChangeUpdate}
              error={errors.service}
            />
            &nbsp;
            <Field
              name="color"
              label="Couleur de l'agent"
              placeholder="#FFFFFF"
              value={agentUpdate.color}
              onChange={handleChangeUpdate}
            />
            &nbsp;
            <div>
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
            </div>
            <div className="form-group" style={{ paddingTop: 20 }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
              >
                Enregistrer
              </Button>
              <Link to="/agents" className="btn btn-link">
                Retour à la liste
              </Link>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default AgentPage;
