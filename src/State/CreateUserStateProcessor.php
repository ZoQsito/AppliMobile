<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Symfony\Component\Mailer\Envelope;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\RawMessage;

class CreateUserStateProcessor implements ProcessorInterface
{
    public function __construct(private readonly ProcessorInterface $processor, private MailerInterface $mailer) {
        
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        /** @var User  */
        $data = $data;
        $this->processor->process($data, $operation, $uriVariables, $context) ;
        $this->mailer->send(new RawMessage('Voici un lien pour modifier votre Mot de Passe'),new Envelope(new Address('admin@justice.fr'),[new Address($data->getEmail())]));
    }
}
