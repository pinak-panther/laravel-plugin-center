<?php


namespace App\Repository;

use App\Models\Application;
class ApplicationRepository implements ApplicationRepositoryInterface
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
        return Application::orderBy($sortField,$sortDirection)->paginate($perPage);
    }

    /**
     * @param string $id
     * @return Application|Application[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|mixed
     */
    public function find($id)
    {
        return Application::findOrFail($id);
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
     * @return Application|\Illuminate\Database\Eloquent\Model|mixed
     */
    public function store($inputs)
    {
        return Application::create([
            'name'=>$inputs['name'],
            'shopify_app_id'=>$inputs['shopifyAppId'],
            'shopify_app_url'=>$inputs['shopifyAppUrl'],
            'description'=>$inputs['description'],
        ]);
    }

    /**
     * @param array $inputs
     * @param string $id
     * @return bool|mixed
     */
    public function edit($inputs,$id)
    {
        $application = $this->find($id);
        return $application->update([
            'name'=>$inputs['name'],
            'shopify_app_id'=>$inputs['shopifyAppId'],
            'shopify_app_url'=>$inputs['shopifyAppUrl'],
            'description'=>$inputs['description'],
        ]);
    }
}
