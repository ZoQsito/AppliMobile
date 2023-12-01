<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\TicketRepository;
use DateTime;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\HasLifecycleCallbacks;
use Doctrine\ORM\Mapping\PrePersist;
use Doctrine\ORM\Mapping\PreUpdate;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TicketRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['ticket:read']]
)]
#[HasLifecycleCallbacks]
class Ticket
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['ticket:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'tickets')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['ticket:read'])]
    private ?Application $app = null;

    #[ORM\ManyToOne(inversedBy: 'tickets')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['ticket:read'])]
    private ?Etat $etat = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['ticket:read'])]
    private ?string $description = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['ticket:read'])]
    private ?\DateTimeInterface $dateStart = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['ticket:read'])]
    private ?\DateTimeInterface $dateEnd = null;

    #[ORM\ManyToOne(inversedBy: 'tickets')]
    #[Groups(['ticket:read'])]
    private ?User $userId = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getApp(): ?Application
    {
        return $this->app;
    }

    public function setApp(?Application $app): static
    {
        $this->app = $app;

        return $this;
    }

    public function getEtat(): ?Etat
    {
        return $this->etat;
    }

    public function setEtat(?Etat $etat): static
    {
        $this->etat = $etat;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDateStart(): ?\DateTimeInterface
    {
        return $this->dateStart;
    }

    public function setDateStart(?\DateTimeInterface $dateStart): static
    {
        $this->dateStart = $dateStart;

        return $this;
    }

    public function getDateEnd(): ?\DateTimeInterface
    {
        return $this->dateEnd;
    }

    public function setDateEnd(?\DateTimeInterface $dateEnd): static
    {
        $this->dateEnd = $dateEnd;

        return $this;
    }

    public function getUserId(): ?User
    {
        return $this->userId;
    }

    public function setUserId(?User $userId): static
    {
        $this->userId = $userId;

        return $this;
    }


    #[PreUpdate]
    public function initiateEnd(PreUpdateEventArgs $event)
    {
        if ($this->getEtat()->getName() === "Ferme")
            $this->dateEnd = new DateTime();
    }

    #[PrePersist]
    public function initiateDebut()
    {

        $this->dateStart = new DateTime();
    }
}
