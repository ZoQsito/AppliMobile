<?php

// src/EventListener/YourJwtListener.php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JWTListener
{
    public function onJwtCreated(JWTCreatedEvent $event)
    {
        $jwt = $event->getData();


        /** @var User */
        $user = $event->getUser();

        $userData = [
            "UserId" => $user->getId()
        ];

        $jwt['custom_data'] = $userData;

        $event->setData($jwt);
    }
}