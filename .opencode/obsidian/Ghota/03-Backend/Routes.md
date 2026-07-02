# Routes

> Ficheiro: `routes/web.php`

## Páginas Públicas
```
GET       /                                           Welcome (Inertia)
GET       /privacidade                                Privacy (Inertia)
GET       /termos                                     Terms (Inertia)
GET       /recursos                                   Features (Inertia)
GET       /precos                                     Pricing (Inertia)
GET       /precos/personalizar                        Customize (Inertia)
GET       /ajuda                                      Help (Inertia)
GET       /contacto                                   ContactController@show
POST      /contacto                                   ContactController@send
```

## Auth
```
GET/POST  /login
GET/POST  /register
POST      /logout
```

## Dashboard
```
GET       /dashboard                                  Dashboard (Inertia, auth)
GET       /calendario                                 Calendar (Inertia, auth)
GET/PATCH /profile                                    ProfileController (auth)
```

## Comunidades (públicas)
```
GET       /comunidades                                CommunityController@index
GET       /comunidades/{community}                    CommunityController@show
```

## Stripe Webhook (sem auth, sem CSRF)
```
POST      /stripe/webhook                             StripeWebhookController
```

## Comunidades (autenticado)
```
GET       /comunidades/criar                          CommunityController@create
POST      /comunidades                                CommunityController@store
GET       /comunidades/{community}/editar             CommunityController@edit
PUT       /comunidades/{community}                    CommunityController@update
DELETE    /comunidades/{community}                    CommunityController@destroy

GET       /comunidades/{community}/entrar             CommunityController@joinForm
POST      /comunidades/{community}/entrar             JoinCommunityController

GET       /comunidades/{community}/pagamento-sucesso  CommunityController@paymentSuccess
GET       /comunidades/{community}/gerir              CommunityController@manage
GET       /comunidades/{community}/connect            ConnectController@onboarding
GET       /comunidades/{community}/connect/atualizar  ConnectController@update

DELETE    /comunidades/{community}/membros/{user}     CommunityController@removeMember
PUT       /comunidades/{community}/membros/{user}/cargo  CommunityController@changeMemberRole

POST      /comunidades/{community}/roles              CommunityController@storeRole
PUT       /comunidades/{community}/roles/{role}       CommunityController@updateRole
DELETE    /comunidades/{community}/roles/{role}       CommunityController@destroyRole
```

## App Interna (Inertia)
```
GET       /comunidades/{community}/app                Redirect → app/canais/{primeiro_canal}
GET       /comunidades/{community}/app/{section?}/{sub?}  CommunityController@app
GET       /comunidades/{community}/c/{canal}          CommunityController@channel
```

## Categories
```
POST      /categorias                                 CategoryController@store
PUT       /categorias/{category}                      CategoryController@update
DELETE    /categorias/{category}                      CategoryController@destroy
```

## Channels
```
POST      /canais                                     ChannelController@store
PUT       /canais/{channel}                           ChannelController@update
DELETE    /canais/{channel}                           ChannelController@destroy
```

## Messages
```
GET       /canais/{channel}/mensagens                 MessageController@index
POST      /canais/{channel}/mensagens                 MessageController@store
PUT       /canais/{channel}/mensagens/{message}       MessageController@update
DELETE    /canais/{channel}/mensagens/{message}       MessageController@destroy
```

## Notas
- Rotas em português (`/canais`, `/comunidades`, `/mensagens`)
- Webhook Stripe excluído CSRF no `VerifyCsrfToken`
- Messages usa rate limit (5/10s por user)
- Channels auth: membro da comunidade
