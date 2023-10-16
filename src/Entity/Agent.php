<?php

namespace App\Entity;


use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\AgentRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AgentRepository::class)]
#[Put(security: "is_granted('ROLE_RESP')" )]
#[Post(security: "is_granted('ROLE_RESP')")]

#[ApiResource]
class Agent
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['events:read', 'user:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['events:read', 'user:read'])]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    #[Groups(['events:read', 'user:read'])]
    private ?string $prenom = null;


    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['events:read', 'user:read'])]
    private ?string $telephone = null;

    #[ORM\Column(length: 255)]
    #[Groups(['events:read', 'user:read'])]
    private ?string $service = null;

    #[ORM\OneToOne(inversedBy:'agent',targetEntity: User::class,cascade:['persist'])]
    #[ORM\JoinColumn(name: "user_id", referencedColumnName: "id")]
    private ?User $user = null;
    
    #[ORM\OneToMany(targetEntity: Events::class, mappedBy: "agent", cascade: ["remove"])]
    private $events;

    #[ORM\Column(length: 255)]
    #[Groups(['events:read', 'user:read'])]
    private ?string $color = null;

    public function __construct()
    {
        $this->events = new ArrayCollection();
    }

    public function getEvents()
    {
        return $this->events;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;

        return $this;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(?string $telephone): static
    {
        $this->telephone = $telephone;

        return $this;
    }

    public function getService(): ?string
    {
        return $this->service;
    }

    public function setService(string $service): static
    {
        $this->service = $service;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): void
    {
        $this->user = $user;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(string $color): static
    {
        $this->color = $color;

        return $this;
    }

    public function addEvent(Events $event): static
    {
        if (!$this->events->contains($event)) {
            $this->events->add($event);
            $event->setAgent($this);
        }

        return $this;
    }

    public function removeEvent(Events $event): static
    {
        if ($this->events->removeElement($event)) {
            // set the owning side to null (unless already changed)
            if ($event->getAgent() === $this) {
                $event->setAgent(null);
            }
        }

        return $this;
    }
}