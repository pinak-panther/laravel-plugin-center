<?php


namespace App\Repository;

use App\Models\Product;
class ProductRepository implements ProductRepositoryInterface
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
        return Product::orderBy($sortField,$sortDirection)->paginate($perPage);
    }

    /**
     * @param string $id
     * @return Product|Product[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|mixed
     */
    public function find($id)
    {
        return Product::findOrFail($id);
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
     * @return Product|\Illuminate\Database\Eloquent\Model|mixed
     */
    public function store($inputs)
    {
        return Product::create([
            'name'=>$inputs['name'],
            'description'=>$inputs['description'],
            'price'=>$inputs['price'],
            'category'=>$inputs['category']
        ]);
    }

    /**
     * @param array $inputs
     * @param string $id
     * @return bool|mixed
     */
    public function edit($inputs,$id)
    {
        $product = $this->find($id);
        return $product->update([
            'name'=>$inputs['name'],
            'description'=>$inputs['description'],
            'price'=>$inputs['price'],
            'category'=>$inputs['category']
        ]);
    }
}
