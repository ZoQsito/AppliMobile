<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
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
        $this->mailer->send((new TemplatedEmail())
        ->from(new Address('admin@justice.fr', 'Admin'))
        ->to($data->getEmail())
        ->subject("Confirmation de l'email")
        ->htmlTemplate('reset_password/createPassword.html.twig'));
    }
}
