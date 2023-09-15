import React, { useState, useEffect } from "react";
import Field from "../components/Field";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AgentsAPI from "../services/AgentsAPI";

const AgentPage = ({}) => {
  const { id = "new" } = "new";

  const [agent, setAgent] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    service: "",
  });

  const [errors, setErrors] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    service: "",
  });

  const [editing, setEditing] = useState(false);

  // Récuperation du customer en fonction de l'identifiant
  const fetchAgent = async (id) => {
    try {
      const { prenom, nom, telephone, service } = await AgentsAPI.find(id);
      setAgent({ prenom, nom, telephone, service });
    } catch (error) {
      toast.error("L'agent n'a pas pu être chargé");
    }
  };

  //Changement du customer si besoin au chargement du composant ou au changement de l'identifiant
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchAgent(id);
    }
  }, [id]);

  //Gestion des changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setAgent({ ...agent, [name]: value });
  };

  //Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setErrors({});

      if (editing) {
        await AgentsAPI.update(id, agent);
        toast.success("L'agent a bien été modifié");
        window.location.href = "/agents";
      } else {
        await AgentsAPI.create(agent);
        toast.success("L'agent a bien été crée");
        window.location.href = "/agents";
      }
    } catch ({ error }) {
      toast.error("L'agent n'a pas pu être créer");
    }
  };

  return (
    <>
      {(!editing && <h1>Ajout d'un Agent</h1>) || (
        <h1>Modification d'un Agent</h1>
      )}

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
        <div className="form-group">
          <Link to="/agents" className="btn btn-success" onClick={handleSubmit}>
            Enregistrer
          </Link>
          <Link to="/agents" className="btn btn-link">
            Retour à la liste
          </Link>
        </div>
      </form>
    </>
  );
};

export default AgentPage;
