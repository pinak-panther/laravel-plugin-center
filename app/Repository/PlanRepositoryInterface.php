<?php


namespace App\Repository;


interface PlanRepositoryInterface
{
    /**
     * @param array $input
     * @return mixed
     */
    public function getAll(array $input);

    /**
     * @param string $id
     * @return mixed
     */
    public function find(string $id);

    /**
     * @param string $id
     * @return mixed
     */
    public function delete(string $id);


    /**
     * @param array $inputs
     * @return mixed
     */
    public function store(array $inputs);


    /**
     * @param array $inputs
     * @param string $id
     * @return mixed
     */
    public function edit(array $inputs, string $id);
}
