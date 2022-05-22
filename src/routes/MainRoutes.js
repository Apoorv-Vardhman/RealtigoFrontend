import React, { lazy } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

// project imports
import MainLayout from './../layout/MainLayout';
import Loadable from '../component/Loadable';
import AuthGuard from './../utils/route-guard/AuthGuard';
import ServiceCategoryEdit from "../views/services/categories/Edit";
import ServiceEdit from "../views/services/Edit";

// dashboard routing
const Dashboard = Loadable(lazy(() => import('../views/dashboard')));

/*----------------service-------------------*/
const ServiceCategory = Loadable(lazy(()=>import("../views/services/categories")))
const ServiceCategoryCreate = Loadable(lazy(()=>import("../views/services/categories/Create")))
const Services = Loadable(lazy(()=>import("../views/services")))
const ServicesEdit = Loadable(lazy(()=>import("../views/services/Edit")))
const ServicesQuestion = Loadable(lazy(()=>import("../views/services/question")))
const ServicesQuestionCreate = Loadable(lazy(()=>import("../views/services/question/Create")))
const ServicesQuestionEdit = Loadable(lazy(()=>import("../views/services/question/Edit")))
const ServicesCreate = Loadable(lazy(()=>import("../views/services/Create")))


/*-------------------------Equipment---------------------------------*/
const Equipment = Loadable(lazy(()=>import("../views/equipment")))
const EquipmentCreate = Loadable(lazy(()=>import("../views/equipment/Create")))
const EquipmentEdit = Loadable(lazy(()=>import("../views/equipment/Edit")))
const EquipmentQuestion = Loadable(lazy(()=>import("../views/equipment/question/index")))
const EquipmentQuestionEdit = Loadable(lazy(()=>import("../views/equipment/question/Edit")))
const EquipmentQuestionCreate = Loadable(lazy(()=>import("../views/equipment/question/Create")))

/*---------------------------Material---------------------------------*/
const Attribute = Loadable(lazy(()=>import("../views/materials/attribute")));
const AttributeCreate = Loadable(lazy(()=>import("../views/materials/attribute/Create")));
const AttributeEdit = Loadable(lazy(()=>import("../views/materials/attribute/Edit")));
const Materials = Loadable(lazy(()=>import("../views/materials/index")));
const MaterialCreate = Loadable(lazy(()=>import("../views/materials/Create")));
const MaterialEdit = Loadable(lazy(()=>import("../views/materials/Edit")));
const MaterialProduct = Loadable(lazy(()=>import("../views/materials/product")));
const MaterialProductCreate = Loadable(lazy(()=>import("../views/materials/product/Create")));
const MaterialProductEdit = Loadable(lazy(()=>import("../views/materials/product/Edit")));

const MaterialProductAttributes = Loadable(lazy(()=>import("../views/materials/product/attributes")));
const MaterialProductAttributesCreate = Loadable(lazy(()=>import("../views/materials/product/attributes/Create")));

/*---------------------------Orders---------------------------------*/
const Orders = Loadable(lazy(()=>import("../views/orders")));
const OrderDetail = Loadable(lazy(()=>import("../views/orders/OrderDetail")));

/*---------------------------Sliders---------------------------------*/

const Slider = Loadable(lazy(()=> import("../views/sliders")));
const SliderCreate = Loadable(lazy(()=>import("../views/sliders/Create")))

/*---------------------------Users---------------------------------*/
const Users = Loadable(lazy(()=>import("../views/users")));
const UsersDeleted = Loadable(lazy(()=>import("../views/users/Deleted")));
const UserDetail = Loadable(lazy(()=>import("../views/users/Detail")))

//-----------------------|| MAIN ROUTING ||-----------------------//

const MainRoutes = () => {
    const location = useLocation();

    return (
        <Route path={[
                '/dashboard',
                "/services/categories",
                "/services/categories/:id/edit",
                "/services",
                "/services/:id/edit",
                "/services/create",
                "/services/categories/create",
                "/equipments",
                "/equipments/create",
                "/equipments/:id/edit",
                "/equipments/:id/questions",
                "/equipments/:id/questions/create",
                "/services/:id/questions/:question/edit",
                "/services/:id/questions",
                "/services/:id/questions/create",
                "/attributes",
                "/attributes/create",
                "/attributes/:id/edit",
                "/materials",
                "/materials/:id/edit",
                "/materials/create",
                "/material-products",
                "/material-products/create",
                "/material-products/:id/edit",
                "/material-products/:id/attributes",
                "/material-products/:id/attributes/create",
                "/orders",
                "/orders/:id",
                "/sliders",
                "/sliders/create",
                "/users",
                "/users/deleted",
                "/users/:id/detail"
            ]}>
            <MainLayout>
                <Switch location={location} key={location.pathname}>
                    <AuthGuard>
                        <Route exact  path="/dashboard/default" component={Dashboard} />
                        <Route exact  path="/services" component={Services} />
                        <Route exact path="/services/:id/edit" render={(props)=>(
                            <ServiceEdit id={props.match.params.id} />
                        )} />
                        <Route exact  path="/services/create" component={ServicesCreate} />
                        <Route exact  path="/services/categories" component={ServiceCategory} />
                        <Route exact path="/services/categories/:id/edit" render={(props)=>(
                            <ServiceCategoryEdit id={props.match.params.id} />
                        )} />
                        <Route exact  path="/services/categories/create" component={ServiceCategoryCreate} />
                        <Route exact  path="/equipments" component={Equipment} />
                        <Route exact  path="/equipments/:id/edit" render={(props)=>(
                            <EquipmentEdit id={props.match.params.id} />
                        )} />
                        <Route exact  path="/equipments/create" component={EquipmentCreate} />
                        <Route exact path="/equipments/:id/questions" render={(props)=>(
                            <EquipmentQuestion id={props.match.params.id} />
                        )} />
                        <Route exact path="/equipments/:id/questions/:question/edit" render={(props)=>(
                            <EquipmentQuestionEdit id={props.match.params.id} question={props.match.params.question} />
                        )} />
                        <Route exact path="/services/:id/questions" render={(props)=>(
                            <ServicesQuestion id={props.match.params.id} />
                        )} />
                        <Route exact path="/equipments/:id/questions/create" render={(props)=>(
                            <EquipmentQuestionCreate id={props.match.params.id} />
                        )} />
                        <Route exact path="/services/:id/questions/create" render={(props)=>(
                            <ServicesQuestionCreate id={props.match.params.id} />
                        )} />
                        <Route exact path="/services/:id/questions/:question/edit" render={(props)=>(
                            <ServicesQuestionEdit id={props.match.params.id} question={props.match.params.question} />
                        )} />
                        {/*--------material------------*/}
                        <Route exact path="/attributes" component={Attribute} />
                        <Route exact path="/attributes/create" component={AttributeCreate} />
                        <Route exact path="/attributes/:id/edit" render={(props)=>(
                            <AttributeEdit id={props.match.params.id} />
                        )} />

                        <Route exact path="/materials" component={Materials} />
                        <Route exact path="/materials/create" component={MaterialCreate} />
                        <Route exact path="/materials/:id/edit" render={(props)=>(
                            <MaterialEdit id={props.match.params.id} />
                        )} />
                        <Route exact path="/material-products" component={MaterialProduct} />
                        <Route exact path="/material-products/create" component={MaterialProductCreate} />
                        <Route exact path="/material-products/:id/edit" render={(props)=>(
                            <MaterialProductEdit id={props.match.params.id} />
                        )} />
                        <Route exact path="/material-products/:id/attributes" render={(props)=>(
                            <MaterialProductAttributes id={props.match.params.id} />
                        )} />
                        <Route exact path="/material-products/:id/attributes/create" render={(props)=>(
                            <MaterialProductAttributesCreate id={props.match.params.id} />
                        )} />
                        {/*---------orders---------------------*/}
                        <Route exact path="/orders" component={Orders} />
                        <Route exact path="/orders/:id" render={(props) => (
                            <OrderDetail id={props.match.params.id}/>
                        )} />
                        <Route exact path="/sliders" component={Slider} />
                        <Route exact path="/sliders/create" component={SliderCreate} />
                        <Route exact path="/users" component={Users} />
                        <Route exact path="/users/deleted" component={UsersDeleted} />
                        <Route exact path="/users/:id/detail" render={(props)=>(
                            <UserDetail id={props.match.params.id} />
                        )} />
                    </AuthGuard>
                </Switch>
            </MainLayout>
        </Route>
    );
};

export default MainRoutes;
