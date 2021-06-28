<?php


namespace App\Repository;

use App\Models\Plan;
class PlanRepository implements PlanRepositoryInterface
{
    /**
     * @param array $input
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|mixed
     */
    public function getAll($input){
        $sort = ['id','DESC']; //default
        $sortField = $sort[0];
        $sortDirection = strtolower($sort[1]) == 'desc'?'DESC':'ASC';
        $perPage = $input['perPage'] ?? 10;
        return Plan::orderBy($sortField,$sortDirection)->paginate($perPage);
    }

    /**
     * @param string $id
     * @return Plan|Plan[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|mixed
     */
    public function find($id)
    {
        return Plan::findOrFail($id);
    }

    /**
     * @param string $id
     * @return mixed|string
     */
    public function delete($id)
    {
        $user = $this->find($id);
        $user->delete();
        return $id;
    }

    /**
     * @param array $inputs
     * @return Plan|\Illuminate\Database\Eloquent\Model|mixed
     */
    public function store($inputs)
    {
        return Plan::create([
            'name'=>$inputs['name'],
            'price'=>$inputs['price'],
            'duration'=>$inputs['duration'],
        ]);
    }

    /**
     * @param array $inputs
     * @param string $id
     * @return bool|mixed
     */
    public function edit($inputs,$id)
    {
        $plan = $this->find($id);
        return $plan->update([
            'name'=>$inputs['name'],
            'price'=>$inputs['price'],
            'duration'=>$inputs['duration'],
        ]);
    }
}
