<?php

/** @var \Laravel\Lumen\Routing\Router $router */

$router->get('/health', function () {
    return response()->json(['ok' => true]);
});

$router->group(['prefix' => 'auth'], function () use ($router) {
    $router->post('/login', ['middleware' => 'throttle.ip:login', 'uses' => 'AuthController@login']);
    $router->post('/logout', 'AuthController@logout');
    $router->get('/me', ['middleware' => 'auth', 'uses' => 'AuthController@me']);
    $router->put('/me/password', ['middleware' => 'auth', 'uses' => 'AuthController@updatePassword']);
});

$router->group(['prefix' => 'users', 'middleware' => ['auth', 'role:SUPER_ADMIN']], function () use ($router) {
    $router->get('/', 'UserController@index');
    $router->post('/', 'UserController@store');
    $router->put('/{id}', 'UserController@update');
    $router->put('/{id}/reset-password', 'UserController@resetPassword');
    $router->delete('/{id}', 'UserController@destroy');
});

$router->group(['prefix' => 'doctors'], function () use ($router) {
    $router->get('/', 'DoctorController@index');
    $router->get('/{id}', 'DoctorController@show');
    $router->post('/', ['middleware' => 'auth', 'uses' => 'DoctorController@store']);
    $router->put('/{id}', ['middleware' => 'auth', 'uses' => 'DoctorController@update']);
    $router->delete('/{id}', ['middleware' => 'auth', 'uses' => 'DoctorController@destroy']);
});

$router->group(['prefix' => 'videos'], function () use ($router) {
    $router->get('/', 'VideoController@index');
    $router->get('/{id}', 'VideoController@show');
    $router->post('/upload', ['middleware' => 'auth', 'uses' => 'VideoController@initUpload']);
    $router->post('/', ['middleware' => 'auth', 'uses' => 'VideoController@store']);
    $router->put('/{id}', ['middleware' => 'auth', 'uses' => 'VideoController@update']);
    $router->delete('/{id}', ['middleware' => 'auth', 'uses' => 'VideoController@destroy']);
});

$router->group(['prefix' => 'youtube'], function () use ($router) {
    $router->get('/status', ['middleware' => 'auth', 'uses' => 'YoutubeController@status']);
    $router->get('/connect', ['middleware' => ['auth', 'role:SUPER_ADMIN'], 'uses' => 'YoutubeController@connect']);
    $router->get('/callback', 'YoutubeController@callback');
});

$router->group(['prefix' => 'faqs'], function () use ($router) {
    $router->get('/', 'FaqController@index');
    $router->get('/{id}', 'FaqController@show');
    $router->post('/', ['middleware' => 'auth', 'uses' => 'FaqController@store']);
    $router->put('/{id}', ['middleware' => 'auth', 'uses' => 'FaqController@update']);
    $router->delete('/{id}', ['middleware' => 'auth', 'uses' => 'FaqController@destroy']);
});

$router->group(['prefix' => 'insurances'], function () use ($router) {
    $router->get('/', 'InsuranceController@index');
    $router->get('/{id}', 'InsuranceController@show');
    $router->post('/', ['middleware' => 'auth', 'uses' => 'InsuranceController@store']);
    $router->put('/{id}', ['middleware' => 'auth', 'uses' => 'InsuranceController@update']);
    $router->delete('/{id}', ['middleware' => 'auth', 'uses' => 'InsuranceController@destroy']);
});

$router->group(['prefix' => 'exams'], function () use ($router) {
    $router->get('/', 'ExamController@index');
    $router->get('/{id}', 'ExamController@show');
    $router->post('/', ['middleware' => 'auth', 'uses' => 'ExamController@store']);
    $router->put('/{id}', ['middleware' => 'auth', 'uses' => 'ExamController@update']);
    $router->delete('/{id}', ['middleware' => 'auth', 'uses' => 'ExamController@destroy']);
});

$router->group(['prefix' => 'testimonials'], function () use ($router) {
    $router->get('/', 'TestimonialController@index');
    $router->get('/{id}', 'TestimonialController@show');
    $router->post('/', ['middleware' => 'auth', 'uses' => 'TestimonialController@store']);
    $router->put('/{id}', ['middleware' => 'auth', 'uses' => 'TestimonialController@update']);
    $router->delete('/{id}', ['middleware' => 'auth', 'uses' => 'TestimonialController@destroy']);
});

$router->group(['prefix' => 'contact'], function () use ($router) {
    $router->get('/', 'ContactController@show');
    $router->put('/', ['middleware' => 'auth', 'uses' => 'ContactController@update']);
});

$router->group(['prefix' => 'contact-submissions'], function () use ($router) {
    $router->post('/', ['middleware' => 'throttle.ip:contact', 'uses' => 'ContactSubmissionController@store']);
    $router->get('/', ['middleware' => 'auth', 'uses' => 'ContactSubmissionController@index']);
    $router->put('/{id}', ['middleware' => 'auth', 'uses' => 'ContactSubmissionController@update']);
    $router->delete('/{id}', ['middleware' => 'auth', 'uses' => 'ContactSubmissionController@destroy']);
});

$router->post('/upload', ['middleware' => 'auth', 'uses' => 'UploadController@store']);
