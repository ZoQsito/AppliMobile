<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\EventsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EventsRepository::class)]
#[ApiResource]
class Events
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $date_debut = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $date_fin = null;

    #[ORM\Column(length: 255)]
    private ?string $label = null;


    #[ORM\ManyToOne(targetEntity: Agent::class)]
    #[ORM\JoinColumn(name: "agent_id", referencedColumnName: "id")]
    private ?Agent $agent = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $etablissement = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $autreEtablissement = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $objetMission = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Quantification = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $objetReunion = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $ordreJour = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $justification = null;



    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateDebut(): ?\DateTimeInterface
    {
        return $this->date_debut;
    }

    public function setDateDebut(\DateTimeInterface $date_debut): static
    {
        $this->date_debut = $date_debut;

        return $this;
    }

    public function getDateFin(): ?\DateTimeInterface
    {
        return $this->date_fin;
    }

    public function setDateFin(\DateTimeInterface $date_fin): static
    {
        $this->date_fin = $date_fin;

        return $this;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): static
    {
        $this->label = $label;

        return $this;
    }


    public function getAgent(): ?Agent
    {
        return $this->agent;
    }

    public function setAgent(?Agent $agent): self
    {
        $this->agent = $agent;
        return $this;
    }

    public function getEtablissement(): ?string
    {
        return $this->etablissement;
    }

    public function setEtablissement(?string $etablissement): static
    {
        $this->etablissement = $etablissement;

        return $this;
    }

    public function getAutreEtablissement(): ?string
    {
        return $this->autreEtablissement;
    }

    public function setAutreEtablissement(?string $autreEtablissement): static
    {
        $this->autreEtablissement = $autreEtablissement;

        return $this;
    }

    public function getObjetMission(): ?string
    {
        return $this->objetMission;
    }

    public function setObjetMission(?string $objetMission): static
    {
        $this->objetMission = $objetMission;

        return $this;
    }

    public function getQuantification(): ?string
    {
        return $this->Quantification;
    }

    public function setQuantification(?string $Quantification): static
    {
        $this->Quantification = $Quantification;

        return $this;
    }

    public function getObjetReunion(): ?string
    {
        return $this->objetReunion;
    }

    public function setObjetReunion(?string $objetReunion): static
    {
        $this->objetReunion = $objetReunion;

        return $this;
    }

    public function getOrdreJour(): ?string
    {
        return $this->ordreJour;
    }

    public function setOrdreJour(?string $ordreJour): static
    {
        $this->ordreJour = $ordreJour;

        return $this;
    }

    public function getJustification(): ?string
    {
        return $this->justification;
    }

    public function setJustification(?string $justification): static
    {
        $this->justification = $justification;

        return $this;
    }


}
