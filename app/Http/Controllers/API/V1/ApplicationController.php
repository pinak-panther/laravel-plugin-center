<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Application;
use App\Repository\ApplicationRepositoryInterface;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class ApplicationController extends Controller
{
    //Validation Rules
    private $createApplicationRules = [
        'name'=>'required',
        'shopifyAppId'=>'required',
        'shopifyAppUrl'=>'required',
    ];
    private $updateApplicationRules = [
        'name'=>'required',
        'shopifyAppId'=>'required',
        'shopifyAppUrl'=>'required',
    ];
    /**
     * @var ApplicationRepositoryInterface
     */
    private $appRepo;

    public function __construct(ApplicationRepositoryInterface $applicationRepository)
    {
        $this->appRepo = $applicationRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $inputs = $request->all();
        $applications = $this->appRepo->getAll($inputs);
        return $this->sendResponse($applications,'All Applications Retrieved Successfully');
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate($this->createApplicationRules);
        $inputs = $request->only(['name','shopifyAppId','shopifyAppUrl','description']);
        $this->appRepo->store($inputs);
        return $this->sendSuccess("Application Created Successfully");
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        return $this->sendResponse($this->appRepo->find($id),"Application found successfully with Id ".$id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Application  $application
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Application $application)
    {
        $applicationId = $application->id;
        $request->validate($this->updateApplicationRules);
        $inputs = $request->only(['name','shopifyAppId','shopifyAppUrl','description']);
        $this->appRepo->edit($inputs,$applicationId);
        return $this->sendSuccess("Application Update Successfully");
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Application  $application
     * @return \Illuminate\Http\Response
     */
    public function destroy(Application $application)
    {
        $applicationId = $application->id;
        $this->appRepo->delete($applicationId);
        return $this->sendSuccess("Product deleted successfully with Id ".$applicationId);
    }
}
