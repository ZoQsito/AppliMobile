<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230918080633 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE events ADD etablissement VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE events ADD autre_etablissement VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE events ADD objet_mission VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE events ADD quantification VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE events ADD objet_reunion VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE events ADD ordre_jour VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE events ADD justification VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE events DROP etablissement');
        $this->addSql('ALTER TABLE events DROP autre_etablissement');
        $this->addSql('ALTER TABLE events DROP objet_mission');
        $this->addSql('ALTER TABLE events DROP quantification');
        $this->addSql('ALTER TABLE events DROP objet_reunion');
        $this->addSql('ALTER TABLE events DROP ordre_jour');
        $this->addSql('ALTER TABLE events DROP justification');
    }
}
