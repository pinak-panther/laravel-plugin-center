<?php


namespace App\Repository;

use App\Models\Application;
use App\Models\Store;
class StoreRepository implements StoreRepositoryInterface
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
        if(@$input['appId']){
            return Application::findOrFail($input['appId'])->stores()->paginate($perPage);
        }
        return Store::orderBy($sortField,$sortDirection)->paginate($perPage);

    }

    /**
     * @param string $id
     * @return Store|Store[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|mixed
     */
    public function find($id)
    {
        return Store::findOrFail($id);
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
        return Store::updateOrCreate(
            ['current_plan'=>$inputs['current_plan'],'application_id'=>$inputs['application_id'],'name'=>$inputs['name']],
            [
            'email'=>$inputs['email'],
            'status'=>$inputs['status']
            ]
        );
    }

    /**
     * @param array $inputs
     * @param string $id
     * @return bool|mixed
     */
    public function edit($inputs,$id)
    {
        $store = $this->find($id);
        return $store->update([
            'name'=>$inputs['name'],
            'email'=>$inputs['email'],
            'current_plan'=>$inputs['current_plan'],
            'status'=>$inputs['status']
        ]);
    }
}
