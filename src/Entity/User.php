<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\State\CreateUserStateProcessor;
use App\State\UserPasswordHasher;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:create', 'user:update']],
)]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[Put(security: "is_granted('ROLE_ADMIN')", processor: UserPasswordHasher::class)]
#[Delete(security: "is_granted('ROLE_ADMIN')")]
#[Post(security: "is_granted('ROLE_ADMIN')", processor: UserPasswordHasher::class, validationContext: ['groups' => ['Default', 'user:create']])]
#[Get(security: "is_granted('ROLE_ADMIN')")]
#[GetCollection(security: "is_granted('ROLE_ADMIN')")]
#[Post(
    security: "is_granted('ROLE_ADMIN')",
    uriTemplate: '/agents/{id}/createAccount',
    uriVariables: [
        'id' => new Link(
            fromClass: Agent::class,
            fromProperty: 'user'
        )
    ],
    denormalizationContext: ['groups' => ['agent:createAccount']],
    processor: CreateUserStateProcessor::class,
    read:false
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[Groups(['user:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;


    #[ORM\Column(length: 180, unique: true)]
    #[Groups(['user:read', 'user:create', 'user:update','agent:createAccount'])]
    private ?string $username = null;

    #[Assert\NotBlank(groups: ['user:create'])]
    #[Groups(['user:create', 'user:update'])]
    private ?string $plainPassword = null;

    #[ORM\Column]
    #[Groups(['user:read', 'user:create', 'user:update','agent:createAccount'])]
    private array $roles = [];

    #[ORM\Column(length: 180)]
    #[Groups(['user:read', 'user:create', 'user:update','agent:createAccount'])]
    #[Assert\Email(groups: ['user:create', 'user:update','agent:createAccount'])]
    private ?string $email = null;

    #[Groups(['agent:createAccount'])]
    #[ORM\OneToOne(mappedBy:'user',targetEntity: Agent::class)]
    private ?Agent $agent = null;

    /**
     * @var string The hashed password
     */
    #[ORM\Column(nullable: true)]
    private ?string $password = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    public function getPlainPassword(): string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;
        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        $this->plainPassword = null;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getAgent(): ?Agent
    {
        return $this->agent;
    }

    public function setAgent(?Agent $agent): static
    {
        // unset the owning side of the relation if necessary
        if ($agent === null && $this->agent !== null) {
            $this->agent->setUser(null);
        }

        // set the owning side of the relation if necessary
        if ($agent !== null && $agent->getUser() !== $this) {
            $agent->setUser($this);
        }

        $this->agent = $agent;

        return $this;
    }
}
