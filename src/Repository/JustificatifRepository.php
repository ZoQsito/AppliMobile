<?php

namespace App\Repository;

use App\Entity\Justificatif;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Justificatif>
 *
 * @method Justificatif|null find($id, $lockMode = null, $lockVersion = null)
 * @method Justificatif|null findOneBy(array $criteria, array $orderBy = null)
 * @method Justificatif[]    findAll()
 * @method Justificatif[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class JustificatifRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Justificatif::class);
    }

//    /**
//     * @return Justificatif[] Returns an array of Justificatif objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('j')
//            ->andWhere('j.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('j.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Justificatif
//    {
//        return $this->createQueryBuilder('j')
//            ->andWhere('j.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
