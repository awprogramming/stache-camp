webpackJsonp(["main"],{

/***/ "../../../../../src/$$_gendir lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../src/$$_gendir lazy recursive";

/***/ }),

/***/ "../../../../../src/app/app-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_dashboard_dashboard_component__ = __webpack_require__("../../../../../src/app/components/dashboard/dashboard.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_login_login_component__ = __webpack_require__("../../../../../src/app/components/login/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_register_camp_register_camp_component__ = __webpack_require__("../../../../../src/app/components/register-camp/register-camp.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_camps_camps_component__ = __webpack_require__("../../../../../src/app/components/camps/camps.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__guards_auth_guard__ = __webpack_require__("../../../../../src/app/guards/auth.guard.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__guards_notAuth_guard__ = __webpack_require__("../../../../../src/app/guards/notAuth.guard.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__guards_admin_guard__ = __webpack_require__("../../../../../src/app/guards/admin.guard.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__guards_superuser_guard__ = __webpack_require__("../../../../../src/app/guards/superuser.guard.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_module_module_component__ = __webpack_require__("../../../../../src/app/components/module/module.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_counselors_counselors_component__ = __webpack_require__("../../../../../src/app/components/counselors/counselors.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_divisions_divisions_component__ = __webpack_require__("../../../../../src/app/components/divisions/divisions.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_head_staff_head_staff_component__ = __webpack_require__("../../../../../src/app/components/head-staff/head-staff.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__guards_adminOrUser_guard__ = __webpack_require__("../../../../../src/app/guards/adminOrUser.guard.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};















var appRoutes = [
    {
        path: '',
        component: __WEBPACK_IMPORTED_MODULE_3__components_login_login_component__["a" /* LoginComponent */]
    },
    {
        path: 'dashboard',
        component: __WEBPACK_IMPORTED_MODULE_2__components_dashboard_dashboard_component__["a" /* DashboardComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_6__guards_auth_guard__["a" /* AuthGuard */]]
    },
    {
        path: 'register-camp',
        component: __WEBPACK_IMPORTED_MODULE_4__components_register_camp_register_camp_component__["a" /* RegisterCampComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_6__guards_auth_guard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_9__guards_superuser_guard__["a" /* SuperUserGuard */]]
    },
    {
        path: 'camps',
        component: __WEBPACK_IMPORTED_MODULE_5__components_camps_camps_component__["a" /* CampsComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_6__guards_auth_guard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_9__guards_superuser_guard__["a" /* SuperUserGuard */]]
    },
    {
        path: 'login',
        component: __WEBPACK_IMPORTED_MODULE_3__components_login_login_component__["a" /* LoginComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_7__guards_notAuth_guard__["a" /* NotAuthGuard */]]
    },
    {
        path: 'modules',
        component: __WEBPACK_IMPORTED_MODULE_10__components_module_module_component__["a" /* ModuleComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_6__guards_auth_guard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_9__guards_superuser_guard__["a" /* SuperUserGuard */]]
    },
    {
        path: 'counselors',
        component: __WEBPACK_IMPORTED_MODULE_11__components_counselors_counselors_component__["a" /* CounselorsComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_6__guards_auth_guard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_14__guards_adminOrUser_guard__["a" /* AdminOrUserGuard */]]
    },
    {
        path: 'divisions',
        component: __WEBPACK_IMPORTED_MODULE_12__components_divisions_divisions_component__["a" /* DivisionsComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_6__guards_auth_guard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_8__guards_admin_guard__["a" /* AdminGuard */]]
    },
    {
        path: 'head-staff',
        component: __WEBPACK_IMPORTED_MODULE_13__components_head_staff_head_staff_component__["a" /* HeadStaffComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_6__guards_auth_guard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_8__guards_admin_guard__["a" /* AdminGuard */]]
    },
    { path: '**', component: __WEBPACK_IMPORTED_MODULE_3__components_login_login_component__["a" /* LoginComponent */] }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [],
        imports: [__WEBPACK_IMPORTED_MODULE_0__angular_router__["b" /* RouterModule */].forRoot(appRoutes)],
        providers: [],
        bootstrap: [],
        exports: [__WEBPACK_IMPORTED_MODULE_0__angular_router__["b" /* RouterModule */]]
    })
], AppRoutingModule);

//# sourceMappingURL=app-routing.module.js.map

/***/ }),

/***/ "../../../../../src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<app-navbar></app-navbar>\n\n<div class=\"container\">\n  <!-- <flash-messages></flash-messages> -->\n  <router-outlet></router-outlet>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = (function () {
    function AppComponent() {
        this.title = 'app';
    }
    return AppComponent;
}());
AppComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-root',
        template: __webpack_require__("../../../../../src/app/app.component.html"),
        styles: [__webpack_require__("../../../../../src/app/app.component.css")]
    })
], AppComponent);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_routing_module__ = __webpack_require__("../../../../../src/app/app-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_navbar_navbar_component__ = __webpack_require__("../../../../../src/app/components/navbar/navbar.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_home_home_component__ = __webpack_require__("../../../../../src/app/components/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_dashboard_dashboard_component__ = __webpack_require__("../../../../../src/app/components/dashboard/dashboard.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_login_login_component__ = __webpack_require__("../../../../../src/app/components/login/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__services_auth_service__ = __webpack_require__("../../../../../src/app/services/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__guards_auth_guard__ = __webpack_require__("../../../../../src/app/guards/auth.guard.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__guards_notAuth_guard__ = __webpack_require__("../../../../../src/app/guards/notAuth.guard.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__guards_superuser_guard__ = __webpack_require__("../../../../../src/app/guards/superuser.guard.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__guards_admin_guard__ = __webpack_require__("../../../../../src/app/guards/admin.guard.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__guards_adminOrUser_guard__ = __webpack_require__("../../../../../src/app/guards/adminOrUser.guard.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_register_camp_register_camp_component__ = __webpack_require__("../../../../../src/app/components/register-camp/register-camp.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_camps_camps_component__ = __webpack_require__("../../../../../src/app/components/camps/camps.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__services_camps_service__ = __webpack_require__("../../../../../src/app/services/camps.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__services_module_service__ = __webpack_require__("../../../../../src/app/services/module.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__components_module_module_component__ = __webpack_require__("../../../../../src/app/components/module/module.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__components_module_dropdown_module_dropdown_component__ = __webpack_require__("../../../../../src/app/components/module-dropdown/module-dropdown.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__components_counselors_counselors_component__ = __webpack_require__("../../../../../src/app/components/counselors/counselors.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__components_divisions_divisions_component__ = __webpack_require__("../../../../../src/app/components/divisions/divisions.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__components_divisions_dropdown_divisions_dropdown_component__ = __webpack_require__("../../../../../src/app/components/divisions-dropdown/divisions-dropdown.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__components_head_staff_head_staff_component__ = __webpack_require__("../../../../../src/app/components/head-staff/head-staff.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__components_head_staff_dropdown_head_staff_dropdown_component__ = __webpack_require__("../../../../../src/app/components/head-staff-dropdown/head-staff-dropdown.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



























var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_6__components_navbar_navbar_component__["a" /* NavbarComponent */],
            __WEBPACK_IMPORTED_MODULE_7__components_home_home_component__["a" /* HomeComponent */],
            __WEBPACK_IMPORTED_MODULE_8__components_dashboard_dashboard_component__["a" /* DashboardComponent */],
            __WEBPACK_IMPORTED_MODULE_9__components_login_login_component__["a" /* LoginComponent */],
            __WEBPACK_IMPORTED_MODULE_16__components_register_camp_register_camp_component__["a" /* RegisterCampComponent */],
            __WEBPACK_IMPORTED_MODULE_17__components_camps_camps_component__["a" /* CampsComponent */],
            __WEBPACK_IMPORTED_MODULE_20__components_module_module_component__["a" /* ModuleComponent */],
            __WEBPACK_IMPORTED_MODULE_21__components_module_dropdown_module_dropdown_component__["a" /* ModuleDropdownComponent */],
            __WEBPACK_IMPORTED_MODULE_22__components_counselors_counselors_component__["a" /* CounselorsComponent */],
            __WEBPACK_IMPORTED_MODULE_23__components_divisions_divisions_component__["a" /* DivisionsComponent */],
            __WEBPACK_IMPORTED_MODULE_24__components_divisions_dropdown_divisions_dropdown_component__["a" /* DivisionsDropdownComponent */],
            __WEBPACK_IMPORTED_MODULE_25__components_head_staff_head_staff_component__["a" /* HeadStaffComponent */],
            __WEBPACK_IMPORTED_MODULE_26__components_head_staff_dropdown_head_staff_dropdown_component__["a" /* HeadStaffDropdownComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["HttpModule"],
            __WEBPACK_IMPORTED_MODULE_4__app_routing_module__["a" /* AppRoutingModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["b" /* ReactiveFormsModule */]
        ],
        providers: [__WEBPACK_IMPORTED_MODULE_10__services_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_18__services_camps_service__["a" /* CampsService */], __WEBPACK_IMPORTED_MODULE_19__services_module_service__["a" /* ModuleService */], __WEBPACK_IMPORTED_MODULE_11__guards_auth_guard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_12__guards_notAuth_guard__["a" /* NotAuthGuard */], __WEBPACK_IMPORTED_MODULE_13__guards_superuser_guard__["a" /* SuperUserGuard */], __WEBPACK_IMPORTED_MODULE_14__guards_admin_guard__["a" /* AdminGuard */], __WEBPACK_IMPORTED_MODULE_15__guards_adminOrUser_guard__["a" /* AdminOrUserGuard */]],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "../../../../../src/app/components/camps/camps.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/components/camps/camps.component.html":
/***/ (function(module, exports) {

module.exports = "<table class=\"table\">\n  <tr>\n    <th>Camp</th>\n    <th>Admin Email</th>\n    <th>Modules</th>\n  </tr>\n  <tr *ngFor=\"let camp of camps\">\n    <td>{{camp.name}}</td>\n    <td>{{camp.admin.email}}</td>\n    <td>\n      <p *ngFor=\"let module of camp.modules\">{{module.formal}}</p>\n      <button class=\"btn btn-primary\" (click) = \"showAddModule(camp)\" *ngIf = \"!camp.hideAdd\">+</button>\n      <app-module-dropdown (selectedChanged) = \"preAdd($event,camp)\" *ngIf = \"camp.hideAdd\" [campModules]=\"camp.modules\"></app-module-dropdown>\n      <button class=\"btn btn-primary\" *ngIf = \"camp.hideAdd\" (click) = \"addModule(camp)\">Add</button>\n    </td>\n  </tr>\n</table>\n"

/***/ }),

/***/ "../../../../../src/app/components/camps/camps.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CampsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_auth_service__ = __webpack_require__("../../../../../src/app/services/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_camps_service__ = __webpack_require__("../../../../../src/app/services/camps.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_module_service__ = __webpack_require__("../../../../../src/app/services/module.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CampsComponent = (function () {
    function CampsComponent(authService, campsService, moduleService, router) {
        this.authService = authService;
        this.campsService = campsService;
        this.moduleService = moduleService;
        this.router = router;
    }
    CampsComponent.prototype.getAllCamps = function () {
        var _this = this;
        this.campsService.getAllCamps().subscribe(function (data) {
            _this.camps = data.camps;
        });
    };
    CampsComponent.prototype.showAddModule = function (camp) {
        camp.hideAdd = true;
    };
    CampsComponent.prototype.hideAddModule = function (camp) {
        camp.hideAdd = false;
    };
    CampsComponent.prototype.addModule = function (camp) {
        var _this = this;
        this.campsService.activateModule(camp).subscribe(function (data) {
            _this.hideAddModule(camp);
            _this.getAllCamps();
            // if (!data.success) {
            //   this.messageClass = 'alert alert-danger';
            //   this.message = data.message;
            // } else {
            //   this.messageClass = 'alert alert-success';
            //   this.message = data.message;
            //   console.log(this.message);
            //   this.hideAddModule(camp);
            // }
        });
    };
    CampsComponent.prototype.preAdd = function (e, camp) {
        camp.toAdd = e;
    };
    CampsComponent.prototype.ngOnInit = function () {
        this.getAllCamps();
    };
    return CampsComponent;
}());
CampsComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-camps',
        template: __webpack_require__("../../../../../src/app/components/camps/camps.component.html"),
        styles: [__webpack_require__("../../../../../src/app/components/camps/camps.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_camps_service__["a" /* CampsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_camps_service__["a" /* CampsService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__services_module_service__["a" /* ModuleService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__services_module_service__["a" /* ModuleService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_router__["a" /* Router */]) === "function" && _d || Object])
], CampsComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=camps.component.js.map

/***/ }),

/***/ "../../../../../src/app/components/counselors/counselors.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/components/counselors/counselors.component.html":
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"newCamp\">\n    <h2 class=\"page-header\">Register Counselor</h2>\n    \n    <!-- Custom Success/Error Message -->\n    <div class=\"row show-hide-message\">\n      <div [ngClass]=\"messageClass\">\n        {{ message }}\n      </div>\n    </div>\n    \n    <!-- Login Form -->\n    <form [formGroup]=\"form\" (submit)=\"onRegistrationSubmit()\">\n    \n      <div class=\"form-group\">\n        <label for=\"first\">First Name</label>\n        <div>\n          <input class=\"form-control\" type=\"text\" name=\"first\" formControlName=\"first\" />\n        </div>\n      </div>\n    \n      <div class=\"form-group\">\n        <label for=\"last\">Last Name</label>\n        <div>\n          <input class=\"form-control\" type=\"text\" name=\"last\" formControlName=\"last\" />\n        </div>\n      </div>\n      \n      <div class=\"form-group\">\n        <label for=\"gender\">Gender</label>\n        <div>\n          <div>\n            <input class=\"form-check-input\" formControlName=\"gender\" type=\"radio\" name=\"gender\" value=\"male\">\n            <label class=\"form-check-label\">Male</label>\n          </div>\n          <div>\n              <input class=\"form-check-input\" formControlName=\"gender\" type=\"radio\" name=\"gender\" value=\"female\">\n              <label class=\"form-check-label\">Female</label>\n            </div>\n        </div>\n      </div>\n\n      <div class=\"form-group\">\n        <label for=\"description\">Division</label>\n        <div>\n        </div>\n      </div>\n    \n      <!-- Submit Button -->\n      <input [disabled]=\"processing\" class=\"btn btn-primary\" type=\"submit\" value=\"Register\" />\n      <input class=\"btn btn-primary\" (click) = \"cancelAdd()\" value=\"Cancel Add\" />\n    </form>\n    </div>\n    \n    <button class=\"btn btn-primary\" (click) = \"showAdd()\" *ngIf = \"!newCamp && authService.admin()\">Add</button>\n    \n    <table class=\"table\" *ngIf=\"authService.admin()\">\n      <tr>\n        <th>First</th>\n        <th>Last</th>\n        <th>Gender</th>\n        <th>Division</th>\n        <th></th>\n      </tr>\n      <tr *ngFor=\"let counselor of counselors\">\n        <td>{{counselor.first}}</td>\n        <td>{{counselor.last}}</td>\n        <td>{{counselor.gender}}</td>\n        <td *ngIf=\"counselor.division \">{{counselor.division.name}}</td>\n        <td *ngIf=\"!counselor.division\">\n          <app-divisions-dropdown (selectedChanged) = \"preAdd($event,counselor)\" [gender]=\"counselor.gender\"></app-divisions-dropdown>\n          <button class=\"btn btn-primary\" (click) = \"addDivision(counselor)\">Add</button>\n        </td>\n        <td><button class=\"btn btn-primary\" (click) = \"remove(counselor)\">X</button></td>\n      </tr>\n    </table>\n    <div *ngIf=\"authService.isUser()\">\n      <div *ngFor=\"let division of divisions\">\n      <h2>{{division}}</h2>\n      <table class=\"table\" >\n          <tr>\n            <th>First</th>\n            <th>Last</th>\n            <th>Gender</th>\n            <th *ngIf=\"authService.admin()\">Division</th>\n            <th *ngIf=\"authService.admin()\"></th>\n          </tr>\n          <tr *ngFor=\"let counselor of counselors[division]\">\n            <td>{{counselor.first}}</td>\n            <td>{{counselor.last}}</td>\n            <td>{{counselor.gender}}</td>\n            <td *ngIf=\"counselor.division && authService.admin()\">{{counselor.division.name}}</td>\n            <td *ngIf=\"!counselor.division && authService.admin()\">\n              <app-divisions-dropdown (selectedChanged) = \"preAdd($event,counselor)\" [gender]=\"counselor.gender\"></app-divisions-dropdown>\n              <button class=\"btn btn-primary\" (click) = \"addDivision(counselor)\">Add</button>\n            </td>\n            <td *ngIf=\"authService.admin()\"><button class=\"btn btn-primary\" (click) = \"remove(counselor)\">X</button></td>\n          </tr>\n        </table>\n      </div>\n    </div>\n    "

/***/ }),

/***/ "../../../../../src/app/components/counselors/counselors.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CounselorsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_camps_service__ = __webpack_require__("../../../../../src/app/services/camps.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__ = __webpack_require__("../../../../../src/app/guards/auth.guard.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_auth_service__ = __webpack_require__("../../../../../src/app/services/auth.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CounselorsComponent = (function () {
    function CounselorsComponent(formBuilder, campsService, authService, router, authGuard) {
        this.formBuilder = formBuilder;
        this.campsService = campsService;
        this.authService = authService;
        this.router = router;
        this.authGuard = authGuard;
        this.processing = false;
        this.newCamp = false;
        this.createForm();
    }
    CounselorsComponent.prototype.createForm = function () {
        this.form = this.formBuilder.group({
            first: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required],
            last: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required],
            gender: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required]
        });
    };
    CounselorsComponent.prototype.onRegistrationSubmit = function () {
        var _this = this;
        this.processing = true;
        var counselor = {
            first: this.form.get('first').value,
            last: this.form.get('last').value,
            gender: this.form.get('gender').value
        };
        this.campsService.registerCounselor(counselor).subscribe(function (data) {
            if (!data.success) {
                _this.messageClass = 'alert alert-danger';
                _this.message = data.message;
                _this.processing = false;
            }
            else {
                _this.messageClass = 'alert alert-success';
                _this.message = data.message;
                setTimeout(function () {
                    if (_this.previousUrl)
                        _this.router.navigate([_this.previousUrl]);
                    else {
                        _this.newCamp = false;
                        _this.getAllCounselors();
                    }
                }, 2000);
            }
        });
    };
    CounselorsComponent.prototype.getAllCounselors = function () {
        var _this = this;
        this.campsService.getAllCounselors().subscribe(function (data) {
            if (_this.authService.isUser()) {
                _this.divisions = Object.keys(data.counselors);
            }
            _this.counselors = data.counselors;
        });
    };
    CounselorsComponent.prototype.remove = function (counselor) {
        var _this = this;
        this.campsService.removeCounselor(counselor).subscribe(function (data) {
            if (!data.success) {
                _this.messageClass = 'alert alert-danger';
                _this.message = data.message;
                _this.processing = false;
            }
            else {
                _this.messageClass = 'alert alert-success';
                _this.message = data.message;
                _this.getAllCounselors();
            }
        });
    };
    CounselorsComponent.prototype.addDivision = function (counselor) {
        var _this = this;
        this.campsService.addDivisionToCounselor(counselor).subscribe(function (data) {
            _this.getAllCounselors();
        });
    };
    CounselorsComponent.prototype.preAdd = function (e, counselor) {
        counselor.toAdd = e;
    };
    CounselorsComponent.prototype.showAdd = function () {
        this.newCamp = true;
    };
    CounselorsComponent.prototype.cancelAdd = function () {
        this.newCamp = false;
    };
    CounselorsComponent.prototype.ngOnInit = function () {
        if (this.authGuard.redirectUrl) {
            this.messageClass = 'alert alert-danger';
            this.message = 'You must be logged in to view that page';
            this.previousUrl = this.authGuard.redirectUrl;
            this.authGuard.redirectUrl = undefined;
        }
        this.getAllCounselors();
    };
    return CounselorsComponent;
}());
CounselorsComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-counselors',
        template: __webpack_require__("../../../../../src/app/components/counselors/counselors.component.html"),
        styles: [__webpack_require__("../../../../../src/app/components/counselors/counselors.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_camps_service__["a" /* CampsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_camps_service__["a" /* CampsService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_5__services_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__services_auth_service__["a" /* AuthService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__["a" /* AuthGuard */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__["a" /* AuthGuard */]) === "function" && _e || Object])
], CounselorsComponent);

var _a, _b, _c, _d, _e;
//# sourceMappingURL=counselors.component.js.map

/***/ }),

/***/ "../../../../../src/app/components/dashboard/dashboard.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/components/dashboard/dashboard.component.html":
/***/ (function(module, exports) {

module.exports = "<h1 class=\"page-header\">Dashboard Route</h1>"

/***/ }),

/***/ "../../../../../src/app/components/dashboard/dashboard.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_auth_service__ = __webpack_require__("../../../../../src/app/services/auth.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DashboardComponent = (function () {
    function DashboardComponent(authService) {
        this.authService = authService;
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.getProfile().subscribe(function (data) {
            _this.user = data.user;
        });
    };
    return DashboardComponent;
}());
DashboardComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-dashboard',
        template: __webpack_require__("../../../../../src/app/components/dashboard/dashboard.component.html"),
        styles: [__webpack_require__("../../../../../src/app/components/dashboard/dashboard.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_auth_service__["a" /* AuthService */]) === "function" && _a || Object])
], DashboardComponent);

var _a;
//# sourceMappingURL=dashboard.component.js.map

/***/ }),

/***/ "../../../../../src/app/components/divisions-dropdown/divisions-dropdown.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/components/divisions-dropdown/divisions-dropdown.component.html":
/***/ (function(module, exports) {

module.exports = "<select (change) = \"handleChange($event);\" class=\"form-control\" name=\"division\" >\n  <option *ngFor=\"let division of divisions; index as i\" value=\"{{i}}\">{{division.name}}</option>\n</select>"

/***/ }),

/***/ "../../../../../src/app/components/divisions-dropdown/divisions-dropdown.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DivisionsDropdownComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_camps_service__ = __webpack_require__("../../../../../src/app/services/camps.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DivisionsDropdownComponent = (function () {
    function DivisionsDropdownComponent(campService) {
        this.campService = campService;
        this.selectedChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    DivisionsDropdownComponent.prototype.populateDivisions = function () {
        var _this = this;
        this.campService.getAllDivisions().subscribe(function (data) {
            console.log(data.divisions);
            if (_this.gender == "female")
                _this.divisions = data.divisions[0].divisions;
            else if (_this.gender == "male")
                _this.divisions = data.divisions[1].divisions;
            _this.selectedChanged.emit(_this.divisions[0]);
        });
    };
    DivisionsDropdownComponent.prototype.handleChange = function (e) {
        this.selectedChanged.emit(this.divisions[e.target.value]);
    };
    DivisionsDropdownComponent.prototype.ngOnInit = function () {
        this.populateDivisions();
    };
    return DivisionsDropdownComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], DivisionsDropdownComponent.prototype, "gender", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], DivisionsDropdownComponent.prototype, "selectedChanged", void 0);
DivisionsDropdownComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-divisions-dropdown',
        template: __webpack_require__("../../../../../src/app/components/divisions-dropdown/divisions-dropdown.component.html"),
        styles: [__webpack_require__("../../../../../src/app/components/divisions-dropdown/divisions-dropdown.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_camps_service__["a" /* CampsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_camps_service__["a" /* CampsService */]) === "function" && _a || Object])
], DivisionsDropdownComponent);

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (propName != "leaders") {
            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }
    }
    // If we made it this far, objects
    // are considered equivalent
    return true;
}
var _a;
//# sourceMappingURL=divisions-dropdown.component.js.map

/***/ }),

/***/ "../../../../../src/app/components/divisions/divisions.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/components/divisions/divisions.component.html":
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"newCamp\">\n    <h2 class=\"page-header\">Register Division</h2>\n    \n    <!-- Custom Success/Error Message -->\n    <div class=\"row show-hide-message\">\n      <div [ngClass]=\"messageClass\">\n        {{ message }}\n      </div>\n    </div>\n    \n    <!-- Login Form -->\n    <form [formGroup]=\"form\" (submit)=\"onRegistrationSubmit()\">\n    \n      <div class=\"form-group\">\n        <label for=\"name\">Name</label>\n        <div>\n          <input class=\"form-control\" type=\"text\" name=\"name\" formControlName=\"name\" />\n        </div>\n      </div>\n    \n      <!-- Submit Button -->\n      <input class=\"btn btn-primary\" type=\"submit\" value=\"Register\" />\n      <input class=\"btn btn-primary\" (click) = \"cancelAdd()\" value=\"Cancel Add\" />\n    </form>\n    </div>\n    \n    <button class=\"btn btn-primary\" (click) = \"showAdd()\" *ngIf = \"!newCamp\">Add</button>\n    <div *ngFor=\"let gender of divisions\">\n      <h2 *ngIf=\"gender._id.gender=='male'\">Boys Side</h2>\n      <h2 *ngIf=\"gender._id.gender=='female'\">Girls Side</h2>\n      <table class=\"table\">\n          <tr>\n            <th>Name</th>\n            <th>Leader(s)</th>\n            <th></th>\n          </tr>\n          <tr *ngFor=\"let division of gender.divisions\">\n            <td>{{division.name}}</td>\n            <td>\n              <p *ngFor=\"let leader of division.leaders\">{{leader.first}} {{leader.last}} <button class=\"btn btn-primary\" (click) = \"removeHead(division._id,leader._id)\">X</button></p>\n              <app-head-staff-dropdown (selectedChanged) = \"preAddHead($event,division)\" (showAddButton) = \"showAddButton($event,division)\" [exclude]=\"division.leaders\"></app-head-staff-dropdown>\n              <button class=\"btn btn-primary\" *ngIf = \"division.showAddButton\" (click) = \"addHead(division)\">Add</button>\n            </td>\n            <td><button class=\"btn btn-primary\" (click) = \"remove(division)\">X</button></td>\n          </tr>\n        </table>\n    </div>\n    "

/***/ }),

/***/ "../../../../../src/app/components/divisions/divisions.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DivisionsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_camps_service__ = __webpack_require__("../../../../../src/app/services/camps.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__ = __webpack_require__("../../../../../src/app/guards/auth.guard.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var DivisionsComponent = (function () {
    function DivisionsComponent(formBuilder, campsService, router, authGuard) {
        this.formBuilder = formBuilder;
        this.campsService = campsService;
        this.router = router;
        this.authGuard = authGuard;
        this.processing = false;
        this.newCamp = false;
        this.createForm();
    }
    DivisionsComponent.prototype.createForm = function () {
        this.form = this.formBuilder.group({
            name: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required]
        });
    };
    DivisionsComponent.prototype.onRegistrationSubmit = function () {
        var _this = this;
        this.processing = true;
        var division = {
            name: this.form.get('name').value
        };
        this.campsService.registerDivision(division).subscribe(function (data) {
            if (!data.success) {
                _this.messageClass = 'alert alert-danger';
                _this.message = data.message;
                _this.processing = false;
            }
            else {
                _this.messageClass = 'alert alert-success';
                _this.message = data.message;
                if (_this.previousUrl)
                    _this.router.navigate([_this.previousUrl]);
                else {
                    _this.newCamp = false;
                    _this.getAllDivisions();
                }
            }
        });
    };
    DivisionsComponent.prototype.getAllDivisions = function () {
        var _this = this;
        this.campsService.getAllDivisions().subscribe(function (data) {
            _this.divisions = data.divisions;
        });
    };
    DivisionsComponent.prototype.remove = function (division) {
        var _this = this;
        this.campsService.removeDivision(division).subscribe(function (data) {
            if (!data.success) {
                _this.messageClass = 'alert alert-danger';
                _this.message = data.message;
                _this.processing = false;
            }
            else {
                _this.messageClass = 'alert alert-success';
                _this.message = data.message;
                _this.getAllDivisions();
            }
        });
    };
    DivisionsComponent.prototype.preAddHead = function (e, division) {
        division.toAdd = e;
    };
    DivisionsComponent.prototype.addHead = function (division) {
        var _this = this;
        this.campsService.addHeadToDivision(division).subscribe(function (data) {
            _this.getAllDivisions();
        });
    };
    DivisionsComponent.prototype.removeHead = function (division_id, leader_id) {
        var _this = this;
        this.campsService.removeHeadFromDivision(division_id, leader_id).subscribe(function (data) {
            _this.getAllDivisions();
        });
    };
    DivisionsComponent.prototype.showAddButton = function (e, division) {
        division.showAddButton = e;
    };
    DivisionsComponent.prototype.showAdd = function () {
        this.newCamp = true;
    };
    DivisionsComponent.prototype.cancelAdd = function () {
        this.newCamp = false;
    };
    DivisionsComponent.prototype.ngOnInit = function () {
        if (this.authGuard.redirectUrl) {
            this.messageClass = 'alert alert-danger';
            this.message = 'You must be logged in to view that page';
            this.previousUrl = this.authGuard.redirectUrl;
            this.authGuard.redirectUrl = undefined;
        }
        this.getAllDivisions();
    };
    return DivisionsComponent;
}());
DivisionsComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-divisions',
        template: __webpack_require__("../../../../../src/app/components/divisions/divisions.component.html"),
        styles: [__webpack_require__("../../../../../src/app/components/divisions/divisions.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_camps_service__["a" /* CampsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_camps_service__["a" /* CampsService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__["a" /* AuthGuard */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__["a" /* AuthGuard */]) === "function" && _d || Object])
], DivisionsComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=divisions.component.js.map

/***/ }),

/***/ "../../../../../src/app/components/head-staff-dropdown/head-staff-dropdown.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/components/head-staff-dropdown/head-staff-dropdown.component.html":
/***/ (function(module, exports) {

module.exports = "<select *ngIf=\"heads && heads.length!=0\" (change) = \"handleChange($event);\">\n  <option *ngFor=\"let head of heads; index as i\" value=\"{{i}}\">{{head.first}} {{head.last}}</option>\n</select>"

/***/ }),

/***/ "../../../../../src/app/components/head-staff-dropdown/head-staff-dropdown.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HeadStaffDropdownComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_camps_service__ = __webpack_require__("../../../../../src/app/services/camps.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var HeadStaffDropdownComponent = (function () {
    function HeadStaffDropdownComponent(campService) {
        this.campService = campService;
        this.selectedChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.showAddButton = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    HeadStaffDropdownComponent.prototype.populateHeads = function () {
        // this.campService.getAllHeads().subscribe(data=>{
        //   this.heads = data.heads;
        //   for(var ex in this.exclude){
        //     for(var head in this.heads){
        //       if(isEquivalent(this.exclude[ex],this.heads[head])){
        //         this.heads.splice(head,1);
        //       }
        //     }
        //   }
        //   this.selectedChanged.emit(this.heads[0]);
        //   this.showAddButton.emit(this.heads.length!=0);
        // });
    };
    HeadStaffDropdownComponent.prototype.handleChange = function (e) {
        this.selectedChanged.emit(this.heads[e.target.value]);
    };
    HeadStaffDropdownComponent.prototype.ngOnInit = function () {
        this.populateHeads();
    };
    return HeadStaffDropdownComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], HeadStaffDropdownComponent.prototype, "exclude", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], HeadStaffDropdownComponent.prototype, "selectedChanged", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], HeadStaffDropdownComponent.prototype, "showAddButton", void 0);
HeadStaffDropdownComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-head-staff-dropdown',
        template: __webpack_require__("../../../../../src/app/components/head-staff-dropdown/head-staff-dropdown.component.html"),
        styles: [__webpack_require__("../../../../../src/app/components/head-staff-dropdown/head-staff-dropdown.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_camps_service__["a" /* CampsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_camps_service__["a" /* CampsService */]) === "function" && _a || Object])
], HeadStaffDropdownComponent);

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    // If we made it this far, objects
    // are considered equivalent
    return true;
}
var _a;
//# sourceMappingURL=head-staff-dropdown.component.js.map

/***/ }),

/***/ "../../../../../src/app/components/head-staff/head-staff.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/components/head-staff/head-staff.component.html":
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"newHead\">\n  <h2 class=\"page-header\">Register Head Staff Member</h2>\n\n  <!-- Custom Success/Error Message -->\n  <div class=\"row show-hide-message\">\n    <div [ngClass]=\"messageClass\">\n      {{ message }}\n    </div>\n  </div>\n\n  <form [formGroup]=\"form\" (submit)=\"onRegistrationSubmit()\">\n      <div class=\"form-group\">\n        <label for=\"first\">First</label>\n        <div>\n          <input class=\"form-control\" type=\"text\" name=\"first\" formControlName=\"first\" />\n        </div>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"last\">Last</label>\n        <div>\n          <input class=\"form-control\" type=\"text\" name=\"last\" formControlName=\"last\" />\n        </div>\n      </div>\n    <div class=\"form-group\">\n      <label for=\"email\">Email</label>\n      <div>\n        <input class=\"form-control\" type=\"text\" name=\"email\" formControlName=\"email\" />\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label for=\"password\">Password</label>\n      <div>\n        <input class=\"form-control\" type=\"password\" name=\"password\" formControlName=\"password\" />\n      </div>\n    </div>\n    <!-- Submit Button -->\n    <input [disabled]=\"processing\" class=\"btn btn-primary\" type=\"submit\" value=\"Register\" />\n  </form>\n</div>\n<button class=\"btn btn-primary\" (click) = \"showAdd()\" *ngIf = \"!newHead\">Add</button>\n<table class=\"table\">\n    <tr>\n      <th>First</th>\n      <th>Last</th>\n      <th>Email</th>\n      <th></th>\n    </tr>\n    <tr *ngFor=\"let head of heads\">\n      <td>{{head.first}}</td>\n      <td>{{head.last}}</td>\n      <td>{{head.email}}</td>\n      <td><button class=\"btn btn-primary\" (click) = \"remove(head)\">X</button></td>\n    </tr>\n  </table>"

/***/ }),

/***/ "../../../../../src/app/components/head-staff/head-staff.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HeadStaffComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_camps_service__ = __webpack_require__("../../../../../src/app/services/camps.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__ = __webpack_require__("../../../../../src/app/guards/auth.guard.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var HeadStaffComponent = (function () {
    function HeadStaffComponent(formBuilder, campsService, router, authGuard) {
        this.formBuilder = formBuilder;
        this.campsService = campsService;
        this.router = router;
        this.authGuard = authGuard;
        this.processing = false;
        this.createForm();
    }
    HeadStaffComponent.prototype.createForm = function () {
        this.form = this.formBuilder.group({
            email: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required],
            password: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required],
            first: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required],
            last: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required]
        });
    };
    HeadStaffComponent.prototype.onRegistrationSubmit = function () {
        var _this = this;
        this.processing = true;
        var headStaff = {
            email: this.form.get('email').value,
            password: this.form.get('password').value,
            first: this.form.get('first').value,
            last: this.form.get('last').value
        };
        this.campsService.registerHeadStaff(headStaff).subscribe(function (data) {
            if (!data.success) {
                _this.messageClass = 'alert alert-danger';
                _this.message = data.message;
                _this.processing = false;
            }
            else {
                _this.messageClass = 'alert alert-success';
                _this.message = data.message;
                _this.getAllHeads();
                _this.newHead = false;
            }
        });
    };
    HeadStaffComponent.prototype.getAllHeads = function () {
        var _this = this;
        this.campsService.getAllHeads().subscribe(function (data) {
            _this.heads = data.heads;
        });
    };
    HeadStaffComponent.prototype.remove = function (head) {
        var _this = this;
        this.campsService.removeHead(head).subscribe(function (data) {
            if (!data.success) {
                _this.messageClass = 'alert alert-danger';
                _this.message = data.message;
                _this.processing = false;
            }
            else {
                _this.messageClass = 'alert alert-success';
                _this.message = data.message;
                _this.getAllHeads();
            }
        });
    };
    HeadStaffComponent.prototype.showAdd = function () {
        this.newHead = true;
    };
    // addDivision(head){
    //   this.campsService.addDivisionToHead(head).subscribe(data => {
    //     this.getAllHeads();
    //   });
    // }
    /* Add Division to head staff member */
    HeadStaffComponent.prototype.preAdd = function (e, head) {
        head.toAdd = e;
    };
    /******/
    HeadStaffComponent.prototype.ngOnInit = function () {
        if (this.authGuard.redirectUrl) {
            this.messageClass = 'alert alert-danger';
            this.message = 'You must be logged in to view that page';
            this.previousUrl = this.authGuard.redirectUrl;
            this.authGuard.redirectUrl = undefined;
        }
        this.getAllHeads();
    };
    return HeadStaffComponent;
}());
HeadStaffComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-head-staff',
        template: __webpack_require__("../../../../../src/app/components/head-staff/head-staff.component.html"),
        styles: [__webpack_require__("../../../../../src/app/components/head-staff/head-staff.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_camps_service__["a" /* CampsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_camps_service__["a" /* CampsService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__["a" /* AuthGuard */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__["a" /* AuthGuard */]) === "function" && _d || Object])
], HeadStaffComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=head-staff.component.js.map

/***/ }),

/***/ "../../../../../src/app/components/home/home.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/components/home/home.component.html":
/***/ (function(module, exports) {

module.exports = "<h1 class=\"page-header\">Home Route</h1>\n"

/***/ }),

/***/ "../../../../../src/app/components/home/home.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var HomeComponent = (function () {
    function HomeComponent() {
    }
    HomeComponent.prototype.ngOnInit = function () {
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-home',
        template: __webpack_require__("../../../../../src/app/components/home/home.component.html"),
        styles: [__webpack_require__("../../../../../src/app/components/home/home.component.css")]
    }),
    __metadata("design:paramtypes", [])
], HomeComponent);

//# sourceMappingURL=home.component.js.map

/***/ }),

/***/ "../../../../../src/app/components/login/login.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/components/login/login.component.html":
/***/ (function(module, exports) {

module.exports = "<h2 class=\"page-header\">Login</h2>\n\n<!-- Custom Success/Error Message -->\n<div class=\"row show-hide-message\">\n  <div [ngClass]=\"messageClass\">\n    {{ message }}\n  </div>\n</div>\n\n<!-- Login Form -->\n<form [formGroup]=\"form\" (submit)=\"onLoginSubmit()\">\n\n  <!-- Username Field -->\n  <div class=\"form-group\">\n    <label for=\"username\">Username</label>\n    <div [ngClass]=\"{'has-error': form.controls.username.errors && form.controls.username.dirty, 'has-success': form.controls.username.valid && form.controls.username.dirty }\">\n      <input class=\"form-control\" type=\"text\" name=\"username\" formControlName=\"username\" />\n      <!-- Validation -->\n      <ul class=\"help-block\">\n        <li *ngIf=\"form.controls.username.errors?.required && form.controls.username.dirty\">This field is required.</li>\n      </ul>\n    </div>\n  </div>\n\n  <!-- Password Field  -->\n  <div class=\"form-group\">\n    <label for=\"password\">Password</label>\n    <div [ngClass]=\"{'has-error': form.controls.password.errors && form.controls.password.dirty, 'has-success': form.controls.password.valid && form.controls.password.dirty }\">\n      <input class=\"form-control\" type=\"password\" name=\"password\" formControlName=\"password\" />\n      <!-- Validation -->\n      <ul class=\"help-block\">\n        <li *ngIf=\"form.controls.password.errors?.required && form.controls.password.dirty\">This field is required.</li>\n      </ul>\n    </div>\n  </div>\n  <!-- Submit Button -->\n  <input [disabled]=\"!form.valid || processing\" class=\"btn btn-primary\" type=\"submit\" value=\"Login\" />\n</form>"

/***/ }),

/***/ "../../../../../src/app/components/login/login.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_auth_service__ = __webpack_require__("../../../../../src/app/services/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__ = __webpack_require__("../../../../../src/app/guards/auth.guard.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var LoginComponent = (function () {
    function LoginComponent(formBuilder, authService, router, authGuard) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.router = router;
        this.authGuard = authGuard;
        this.processing = false;
        this.createForm(); // Create Login Form when component is constructed
    }
    // Function to create login form
    LoginComponent.prototype.createForm = function () {
        this.form = this.formBuilder.group({
            username: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required],
            password: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required] // Password field
        });
    };
    // Function to disable form
    LoginComponent.prototype.disableForm = function () {
        this.form.controls['username'].disable(); // Disable username field
        this.form.controls['password'].disable(); // Disable password field
    };
    // Function to enable form
    LoginComponent.prototype.enableForm = function () {
        this.form.controls['username'].enable(); // Enable username field
        this.form.controls['password'].enable(); // Enable password field
    };
    // Functiont to submit form and login user
    LoginComponent.prototype.onLoginSubmit = function () {
        var _this = this;
        this.processing = true; // Used to submit button while is being processed
        this.disableForm(); // Disable form while being process
        // Create user object from user's input
        var user = {
            email: this.form.get('username').value,
            password: this.form.get('password').value // Password input field
        };
        //Function to send login data to API
        this.authService.login(user).subscribe(function (data) {
            // Check if response was a success or error
            if (!data.success) {
                _this.messageClass = 'alert alert-danger'; // Set bootstrap error class
                _this.message = data.message; // Set error message
                _this.processing = false; // Enable submit button
                _this.enableForm(); // Enable form for editting
            }
            else {
                _this.messageClass = 'alert alert-success'; // Set bootstrap success class
                _this.message = data.message; // Set success message
                // Function to store user's token in client local storage
                _this.authService.storeUserData(data.token, data.user);
                // After 2 seconds, redirect to dashboard page
                setTimeout(function () {
                    if (_this.previousUrl)
                        _this.router.navigate([_this.previousUrl]);
                    else
                        _this.router.navigate(['/modules']); // Navigate to dashboard view
                }, 1000);
            }
        });
    };
    LoginComponent.prototype.ngOnInit = function () {
        if (this.authGuard.redirectUrl) {
            this.messageClass = 'alert alert-danger';
            this.message = 'You must be logged in to view that page';
            this.previousUrl = this.authGuard.redirectUrl;
            this.authGuard.redirectUrl = undefined;
        }
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-login',
        template: __webpack_require__("../../../../../src/app/components/login/login.component.html"),
        styles: [__webpack_require__("../../../../../src/app/components/login/login.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__["a" /* AuthGuard */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__["a" /* AuthGuard */]) === "function" && _d || Object])
], LoginComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=login.component.js.map

/***/ }),

/***/ "../../../../../src/app/components/module-dropdown/module-dropdown.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/components/module-dropdown/module-dropdown.component.html":
/***/ (function(module, exports) {

module.exports = "<select (change) = \"handleChange($event);\">\n  <option *ngFor=\"let module of modules; index as i\" value=\"{{i}}\">{{module.formal}}</option>\n</select>\n\n"

/***/ }),

/***/ "../../../../../src/app/components/module-dropdown/module-dropdown.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ModuleDropdownComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_module_service__ = __webpack_require__("../../../../../src/app/services/module.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_camps_service__ = __webpack_require__("../../../../../src/app/services/camps.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ModuleDropdownComponent = (function () {
    function ModuleDropdownComponent(moduleService, campService) {
        this.moduleService = moduleService;
        this.campService = campService;
        this.selectedChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    ModuleDropdownComponent.prototype.populateModules = function () {
        var _this = this;
        this.moduleService.getAllModules().subscribe(function (data) {
            _this.modules = data.modules;
            for (var cmod in _this.campModules) {
                for (var mod in _this.modules) {
                    if (isEquivalent(_this.campModules[cmod], _this.modules[mod])) {
                        _this.modules.splice(mod, 1);
                    }
                }
            }
            _this.selectedChanged.emit(_this.modules[0]);
        });
    };
    ModuleDropdownComponent.prototype.handleChange = function (e) {
        this.selectedChanged.emit(this.modules[e.target.value]);
    };
    ModuleDropdownComponent.prototype.ngOnInit = function () {
        this.populateModules();
    };
    return ModuleDropdownComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], ModuleDropdownComponent.prototype, "campModules", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], ModuleDropdownComponent.prototype, "selectedChanged", void 0);
ModuleDropdownComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-module-dropdown',
        template: __webpack_require__("../../../../../src/app/components/module-dropdown/module-dropdown.component.html"),
        styles: [__webpack_require__("../../../../../src/app/components/module-dropdown/module-dropdown.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_module_service__["a" /* ModuleService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_module_service__["a" /* ModuleService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_camps_service__["a" /* CampsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_camps_service__["a" /* CampsService */]) === "function" && _b || Object])
], ModuleDropdownComponent);

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    // If we made it this far, objects
    // are considered equivalent
    return true;
}
var _a, _b;
//# sourceMappingURL=module-dropdown.component.js.map

/***/ }),

/***/ "../../../../../src/app/components/module/module.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/components/module/module.component.html":
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"newModule\">\n<h2 class=\"page-header\">Register Module</h2>\n\n<!-- Custom Success/Error Message -->\n<div class=\"row show-hide-message\">\n  <div [ngClass]=\"messageClass\">\n    {{ message }}\n  </div>\n</div>\n\n<!-- Login Form -->\n<form [formGroup]=\"form\" (submit)=\"onRegistrationSubmit()\">\n\n  <div class=\"form-group\">\n    <label for=\"formal\">Module Name</label>\n    <div>\n      <input class=\"form-control\" type=\"text\" name=\"formal\" formControlName=\"formal\" />\n    </div>\n  </div>\n\n  <div class=\"form-group\">\n    <label for=\"short_name\">Module Short Name</label>\n    <div>\n      <input class=\"form-control\" type=\"text\" name=\"short_name\" formControlName=\"short_name\" />\n    </div>\n  </div>\n\n  <div class=\"form-group\">\n    <label for=\"description\">Description</label>\n    <div>\n      <textarea class=\"form-control\" name=\"description\" formControlName=\"description\" ></textarea>\n    </div>\n  </div>\n\n  <!-- Submit Button -->\n  <input [disabled]=\"processing\" class=\"btn btn-primary\" type=\"submit\" value=\"Register\" />\n  <input class=\"btn btn-primary\" (click) = \"cancelAdd()\" value=\"Cancel Add\" />\n</form>\n</div>\n\n<button class=\"btn btn-primary\" (click) = \"showAdd()\" *ngIf = \"!newModule\">Add</button>\n\n<table class=\"table\">\n  <tr>\n    <th>Module</th>\n    <th>Description</th>\n    <th></th>\n  </tr>\n  <tr *ngFor=\"let module of modules\">\n    <td>{{module.formal}}</td>\n    <td>{{module.description}}</td>\n    <td><button class=\"btn btn-primary\" (click) = \"remove(module)\">X</button></td>\n  </tr>\n</table>"

/***/ }),

/***/ "../../../../../src/app/components/module/module.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ModuleComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_module_service__ = __webpack_require__("../../../../../src/app/services/module.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__ = __webpack_require__("../../../../../src/app/guards/auth.guard.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ModuleComponent = (function () {
    function ModuleComponent(formBuilder, moduleService, router, authGuard) {
        this.formBuilder = formBuilder;
        this.moduleService = moduleService;
        this.router = router;
        this.authGuard = authGuard;
        this.processing = false;
        this.newModule = false;
        this.createForm();
    }
    ModuleComponent.prototype.createForm = function () {
        this.form = this.formBuilder.group({
            formal: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required],
            short_name: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required],
            description: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required]
        });
    };
    ModuleComponent.prototype.onRegistrationSubmit = function () {
        var _this = this;
        this.processing = true;
        var mod = {
            formal: this.form.get('formal').value,
            short_name: this.form.get('short_name').value,
            description: this.form.get('description').value,
        };
        this.moduleService.registerModule(mod).subscribe(function (data) {
            if (!data.success) {
                _this.messageClass = 'alert alert-danger';
                _this.message = data.message;
                _this.processing = false;
            }
            else {
                _this.messageClass = 'alert alert-success';
                _this.message = data.message;
                setTimeout(function () {
                    if (_this.previousUrl)
                        _this.router.navigate([_this.previousUrl]);
                    else {
                        _this.newModule = false;
                        _this.getAllModules();
                    }
                }, 2000);
            }
        });
    };
    ModuleComponent.prototype.remove = function (mod) {
        var _this = this;
        this.moduleService.removeModule(mod).subscribe(function (data) {
            if (!data.success) {
                _this.messageClass = 'alert alert-danger';
                _this.message = data.message;
                _this.processing = false;
            }
            else {
                _this.messageClass = 'alert alert-success';
                _this.message = data.message;
                _this.getAllModules();
            }
        });
    };
    ModuleComponent.prototype.showAdd = function () {
        this.newModule = true;
    };
    ModuleComponent.prototype.cancelAdd = function () {
        this.newModule = false;
    };
    ModuleComponent.prototype.getAllModules = function () {
        var _this = this;
        this.moduleService.getAllModules().subscribe(function (data) {
            _this.modules = data.modules;
        });
    };
    ModuleComponent.prototype.ngOnInit = function () {
        if (this.authGuard.redirectUrl) {
            this.messageClass = 'alert alert-danger';
            this.message = 'You must be logged in to view that page';
            this.previousUrl = this.authGuard.redirectUrl;
            this.authGuard.redirectUrl = undefined;
        }
        this.getAllModules();
    };
    return ModuleComponent;
}());
ModuleComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-module',
        template: __webpack_require__("../../../../../src/app/components/module/module.component.html"),
        styles: [__webpack_require__("../../../../../src/app/components/module/module.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_module_service__["a" /* ModuleService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_module_service__["a" /* ModuleService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__["a" /* AuthGuard */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__["a" /* AuthGuard */]) === "function" && _d || Object])
], ModuleComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=module.component.js.map

/***/ }),

/***/ "../../../../../src/app/components/navbar/navbar.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/components/navbar/navbar.component.html":
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar navbar-default\">\n  <div class=\"container-fluid\">\n    <ul class=\"nav navbar-nav navbar-left\">\n      <li [routerLinkActive]=\"['active']\" [routerLinkActiveOptions]=\"{exact:true}\"><a routerLink=\"/\">Home</a></li>\n    </ul>\n\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li *ngIf=\"authService.superUser()\" [routerLinkActive]=\"['active']\" [routerLinkActiveOptions]=\"{exact:true}\"><a routerLink=\"/register-camp\">Register Camp</a></li>\n        <li *ngIf=\"authService.superUser()\" [routerLinkActive]=\"['active']\" [routerLinkActiveOptions]=\"{exact:true}\"><a routerLink=\"/camps\">Camps</a></li>\n        <li *ngIf=\"authService.superUser()\" [routerLinkActive]=\"['active']\" [routerLinkActiveOptions]=\"{exact:true}\"><a routerLink=\"/modules\">Modules</a></li>\n        <li *ngIf=\"authService.admin()\" [routerLinkActive]=\"['active']\" [routerLinkActiveOptions]=\"{exact:true}\"><a routerLink=\"/head-staff\">Head Staff</a></li>\n        <li *ngIf=\"authService.admin()\" [routerLinkActive]=\"['active']\" [routerLinkActiveOptions]=\"{exact:true}\"><a routerLink=\"/divisions\">Divisions</a></li>\n        <li *ngIf=\"authService.admin()||authService.isUser()\" [routerLinkActive]=\"['active']\" [routerLinkActiveOptions]=\"{exact:true}\"><a routerLink=\"/counselors\">Counselors</a></li>\n        <li *ngIf=\"!authService.loggedIn()\" [routerLinkActive]=\"['active']\" [routerLinkActiveOptions]=\"{exact:true}\"><a routerLink=\"/login\">Login</a></li>\n        <li *ngIf=\"authService.loggedIn()\" [routerLinkActive]=\"['active']\" [routerLinkActiveOptions]=\"{exact:true}\"><a routerLink=\"/dashboard\">Dashboard</a></li>\n        <li *ngIf=\"authService.loggedIn()\"><a href=\"#\" (click)=\"onLogoutClick()\" >Logout</a></li>\n      </ul>\n  </div><!-- /.container-fluid -->\n</nav>"

/***/ }),

/***/ "../../../../../src/app/components/navbar/navbar.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NavbarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_auth_service__ = __webpack_require__("../../../../../src/app/services/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



//import { FlashMessagesService } from 'angular2-flash-messages';
var NavbarComponent = (function () {
    function NavbarComponent(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    NavbarComponent.prototype.onLogoutClick = function () {
        this.authService.logout();
        //this.flashMessagesService.show('You are logged out', {cssClass:'alert-info'})
        this.router.navigate(['/']);
    };
    NavbarComponent.prototype.ngOnInit = function () {
    };
    return NavbarComponent;
}());
NavbarComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-navbar',
        template: __webpack_require__("../../../../../src/app/components/navbar/navbar.component.html"),
        styles: [__webpack_require__("../../../../../src/app/components/navbar/navbar.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */]) === "function" && _b || Object])
], NavbarComponent);

var _a, _b;
//# sourceMappingURL=navbar.component.js.map

/***/ }),

/***/ "../../../../../src/app/components/register-camp/register-camp.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/components/register-camp/register-camp.component.html":
/***/ (function(module, exports) {

module.exports = "<h2 class=\"page-header\">Register Camp</h2>\n\n<!-- Custom Success/Error Message -->\n<div class=\"row show-hide-message\">\n  <div [ngClass]=\"messageClass\">\n    {{ message }}\n  </div>\n</div>\n\n<!-- Login Form -->\n<form [formGroup]=\"form\" (submit)=\"onRegistrationSubmit()\">\n\n  <div class=\"form-group\">\n    <label for=\"name\">Camp Name</label>\n    <div>\n      <input class=\"form-control\" type=\"text\" name=\"name\" formControlName=\"name\" />\n    </div>\n  </div>\n  <div class=\"form-group\">\n      <label for=\"admin_first\">Admin First Name</label>\n      <div>\n        <input class=\"form-control\" type=\"text\" name=\"admin_first\" formControlName=\"admin_first\" />\n      </div>\n  </div>\n  <div class=\"form-group\">\n      <label for=\"admin_last\">Admin Last Name</label>\n      <div>\n        <input class=\"form-control\" type=\"text\" name=\"admin_last\" formControlName=\"admin_last\" />\n      </div>\n  </div>\n  <div class=\"form-group\">\n    <label for=\"admin_email\">Admin Email</label>\n    <div>\n      <input class=\"form-control\" type=\"text\" name=\"admin_email\" formControlName=\"admin_email\" />\n    </div>\n  </div>\n\n  <div class=\"form-group\">\n    <label for=\"admin_password\">Admin Password</label>\n    <div>\n      <input class=\"form-control\" type=\"password\" name=\"admin_password\" formControlName=\"admin_password\" />\n    </div>\n  </div>\n\n\n  <!-- Submit Button -->\n  <input [disabled]=\"processing\" class=\"btn btn-primary\" type=\"submit\" value=\"Register\" />\n</form>"

/***/ }),

/***/ "../../../../../src/app/components/register-camp/register-camp.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterCampComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_auth_service__ = __webpack_require__("../../../../../src/app/services/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__ = __webpack_require__("../../../../../src/app/guards/auth.guard.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var RegisterCampComponent = (function () {
    function RegisterCampComponent(formBuilder, authService, router, authGuard) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.router = router;
        this.authGuard = authGuard;
        this.processing = false;
        this.createForm(); // Create Register Form when component is constructed
    }
    // Function to create registration form
    RegisterCampComponent.prototype.createForm = function () {
        this.form = this.formBuilder.group({
            name: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required],
            admin_first: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required],
            admin_last: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required],
            admin_email: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required],
            admin_password: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required]
        });
    };
    // Function to disable form
    RegisterCampComponent.prototype.disableForm = function () {
        this.form.controls['name'].disable(); // Disable username field
        this.form.controls['admin_email'].disable(); // Disable password field
        this.form.controls['admin_password'].enable(); // Enable password field
    };
    // Function to enable form
    RegisterCampComponent.prototype.enableForm = function () {
        this.form.controls['name'].enable(); // Enable username field
        this.form.controls['admin_email'].enable(); // Enable password field
        this.form.controls['admin_password'].enable(); // Enable password field
    };
    // Functiont to submit form and login user
    RegisterCampComponent.prototype.onRegistrationSubmit = function () {
        var _this = this;
        this.processing = true; // Used to submit button while is being processed
        this.disableForm(); // Disable form while being process
        // Create user object from user's input
        var camp = {
            name: this.form.get('name').value,
            admin_first: this.form.get('admin_first').value,
            admin_last: this.form.get('admin_last').value,
            admin_email: this.form.get('admin_email').value,
            admin_password: this.form.get('admin_password').value
        };
        //Function to send login data to API
        this.authService.registerCamp(camp).subscribe(function (data) {
            // Check if response was a success or error
            if (!data.success) {
                _this.messageClass = 'alert alert-danger'; // Set bootstrap error class
                _this.message = data.message; // Set error message
                _this.processing = false; // Enable submit button
                _this.enableForm(); // Enable form for editting
            }
            else {
                _this.messageClass = 'alert alert-success'; // Set bootstrap success class
                _this.message = data.message; // Set success message
                // After 2 seconds, redirect to dashboard page
                setTimeout(function () {
                    if (_this.previousUrl)
                        _this.router.navigate([_this.previousUrl]);
                    else
                        _this.router.navigate(['/camps']); // Navigate to dashboard view
                }, 2000);
            }
        });
    };
    RegisterCampComponent.prototype.ngOnInit = function () {
        if (this.authGuard.redirectUrl) {
            this.messageClass = 'alert alert-danger';
            this.message = 'You must be logged in to view that page';
            this.previousUrl = this.authGuard.redirectUrl;
            this.authGuard.redirectUrl = undefined;
        }
    };
    return RegisterCampComponent;
}());
RegisterCampComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-register-camp',
        template: __webpack_require__("../../../../../src/app/components/register-camp/register-camp.component.html"),
        styles: [__webpack_require__("../../../../../src/app/components/register-camp/register-camp.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__["a" /* AuthGuard */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__guards_auth_guard__["a" /* AuthGuard */]) === "function" && _d || Object])
], RegisterCampComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=register-camp.component.js.map

/***/ }),

/***/ "../../../../../src/app/guards/admin.guard.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminGuard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_auth_service__ = __webpack_require__("../../../../../src/app/services/auth.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AdminGuard = (function () {
    function AdminGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AdminGuard.prototype.canActivate = function (router, state) {
        if (this.authService.admin()) {
            return true;
        }
        else {
            this.redirectUrl = state.url;
            this.router.navigate(['/login']);
            return false;
        }
    };
    return AdminGuard;
}());
AdminGuard = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object])
], AdminGuard);

var _a, _b;
//# sourceMappingURL=admin.guard.js.map

/***/ }),

/***/ "../../../../../src/app/guards/adminOrUser.guard.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminOrUserGuard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_auth_service__ = __webpack_require__("../../../../../src/app/services/auth.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AdminOrUserGuard = (function () {
    function AdminOrUserGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AdminOrUserGuard.prototype.canActivate = function (router, state) {
        if (this.authService.admin() || this.authService.isUser()) {
            return true;
        }
        else {
            this.redirectUrl = state.url;
            this.router.navigate(['/login']);
            return false;
        }
    };
    return AdminOrUserGuard;
}());
AdminOrUserGuard = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object])
], AdminOrUserGuard);

var _a, _b;
//# sourceMappingURL=adminOrUser.guard.js.map

/***/ }),

/***/ "../../../../../src/app/guards/auth.guard.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGuard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_auth_service__ = __webpack_require__("../../../../../src/app/services/auth.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthGuard = (function () {
    function AuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function (router, state) {
        if (this.authService.loggedIn()) {
            return true;
        }
        else {
            this.redirectUrl = state.url;
            this.router.navigate(['/login']);
            return false;
        }
    };
    return AuthGuard;
}());
AuthGuard = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object])
], AuthGuard);

var _a, _b;
//# sourceMappingURL=auth.guard.js.map

/***/ }),

/***/ "../../../../../src/app/guards/notAuth.guard.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotAuthGuard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_auth_service__ = __webpack_require__("../../../../../src/app/services/auth.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var NotAuthGuard = (function () {
    function NotAuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    NotAuthGuard.prototype.canActivate = function () {
        if (this.authService.loggedIn()) {
            this.router.navigate(['/dashboard']);
            return false;
        }
        else {
            return true;
        }
    };
    return NotAuthGuard;
}());
NotAuthGuard = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object])
], NotAuthGuard);

var _a, _b;
//# sourceMappingURL=notAuth.guard.js.map

/***/ }),

/***/ "../../../../../src/app/guards/superuser.guard.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SuperUserGuard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_auth_service__ = __webpack_require__("../../../../../src/app/services/auth.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SuperUserGuard = (function () {
    function SuperUserGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    SuperUserGuard.prototype.canActivate = function (router, state) {
        if (this.authService.superUser()) {
            return true;
        }
        else {
            this.redirectUrl = state.url;
            this.router.navigate(['/login']);
            return false;
        }
    };
    return SuperUserGuard;
}());
SuperUserGuard = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object])
], SuperUserGuard);

var _a, _b;
//# sourceMappingURL=superuser.guard.js.map

/***/ }),

/***/ "../../../../../src/app/services/auth.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__("../../../../rxjs/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular2_jwt__ = __webpack_require__("../../../../angular2-jwt/angular2-jwt.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular2_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_angular2_jwt__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
        //domain = ""; // Production;
        this.domain = "";
    }
    // Function to create headers, add token, to be used in HTTP requests
    AuthService.prototype.createAuthenticationHeaders = function () {
        this.loadToken(); // Get token so it can be attached to headers
        // Headers configuration options
        this.options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["RequestOptions"]({
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_http__["Headers"]({
                'Content-Type': 'application/json',
                'authorization': this.authToken // Attach token
            })
        });
    };
    // Function to get token from client local storage
    AuthService.prototype.loadToken = function () {
        this.authToken = localStorage.getItem('token');
        ; // Get token and asssign to variable to be used elsewhere
    };
    // Function to register user accounts
    AuthService.prototype.registerUser = function (user) {
        return this.http.post(this.domain + 'authentication/register', user).map(function (res) { return res.json(); });
    };
    AuthService.prototype.registerCamp = function (camp) {
        return this.http.post(this.domain + 'authentication/register-camp', camp).map(function (res) { return res.json(); });
    };
    // Function to check if e-mail is taken
    AuthService.prototype.checkEmail = function (email) {
        return this.http.get(this.domain + 'authentication/checkEmail/' + email).map(function (res) { return res.json(); });
    };
    // Function to login user
    AuthService.prototype.login = function (user) {
        return this.http.post(this.domain + 'authentication/login', user).map(function (res) { return res.json(); });
    };
    // Function to logout
    AuthService.prototype.logout = function () {
        this.authToken = null; // Set token to null
        this.user = null; // Set user to null
        localStorage.clear(); // Clear local storage
    };
    // Function to store user's data in client local storage
    AuthService.prototype.storeUserData = function (token, user) {
        localStorage.setItem('token', token); // Set token in local storage
        localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
        this.authToken = token; // Assign token to be used elsewhere
        this.user = user; // Set user to be used elsewhere
    };
    // Function to get user's profile data
    AuthService.prototype.getProfile = function () {
        this.createAuthenticationHeaders(); // Create headers before sending to API
        return this.http.get(this.domain + 'authentication/dashboard', this.options).map(function (res) { return res.json(); });
    };
    // // Function to check if user is logged in
    AuthService.prototype.loggedIn = function () {
        return Object(__WEBPACK_IMPORTED_MODULE_3_angular2_jwt__["tokenNotExpired"])();
    };
    AuthService.prototype.superUser = function () {
        if (this.loggedIn())
            return JSON.parse(localStorage.getItem('user')).permissions == 'superuser';
        else
            return false;
    };
    AuthService.prototype.admin = function () {
        if (this.loggedIn())
            return JSON.parse(localStorage.getItem('user')).permissions == 'admin';
        else
            return false;
    };
    AuthService.prototype.isUser = function () {
        if (this.loggedIn())
            return JSON.parse(localStorage.getItem('user')).permissions == 'user';
        else
            return false;
    };
    return AuthService;
}());
AuthService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["Http"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["Http"]) === "function" && _a || Object])
], AuthService);

var _a;
//# sourceMappingURL=auth.service.js.map

/***/ }),

/***/ "../../../../../src/app/services/camps.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CampsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__auth_service__ = __webpack_require__("../../../../../src/app/services/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CampsService = (function () {
    function CampsService(authService, http) {
        this.authService = authService;
        this.http = http;
        this.domain = this.authService.domain;
    }
    // Function to create headers, add token, to be used in HTTP requests
    CampsService.prototype.createAuthenticationHeaders = function () {
        this.authService.loadToken(); // Get token so it can be attached to headers
        // Headers configuration options
        this.options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["RequestOptions"]({
            headers: new __WEBPACK_IMPORTED_MODULE_2__angular_http__["Headers"]({
                'Content-Type': 'application/json',
                'authorization': this.authService.authToken // Attach token
            })
        });
    };
    CampsService.prototype.getAllCamps = function () {
        this.createAuthenticationHeaders();
        return this.http.get(this.domain + 'camps/all_camps', this.options).map(function (res) { return res.json(); });
    };
    /* MODULES */
    CampsService.prototype.activateModule = function (mod) {
        this.createAuthenticationHeaders();
        return this.http.post(this.domain + 'camps/activate_module', mod, this.options).map(function (res) { return res.json(); });
    };
    /* COUNSELORS */
    CampsService.prototype.getAllCounselors = function () {
        this.createAuthenticationHeaders();
        var permissions = JSON.parse(localStorage.getItem('user')).permissions;
        return this.http.get(this.domain + 'camps/all_counselors/' + permissions, this.options).map(function (res) { return res.json(); });
    };
    CampsService.prototype.registerCounselor = function (counselor) {
        this.createAuthenticationHeaders();
        return this.http.post(this.domain + 'camps/add_counselor', counselor, this.options).map(function (res) { return res.json(); });
    };
    CampsService.prototype.removeCounselor = function (counselor) {
        this.createAuthenticationHeaders();
        return this.http.delete(this.domain + 'camps/remove_counselor/' + counselor._id, this.options).map(function (res) { return res.json(); });
    };
    /* DIVISIONS */
    CampsService.prototype.getAllDivisions = function () {
        this.createAuthenticationHeaders();
        return this.http.get(this.domain + 'camps/all_divisions', this.options).map(function (res) { return res.json(); });
    };
    CampsService.prototype.registerDivision = function (division) {
        this.createAuthenticationHeaders();
        return this.http.post(this.domain + 'camps/register_division', division, this.options).map(function (res) { return res.json(); });
    };
    CampsService.prototype.removeDivision = function (division) {
        this.createAuthenticationHeaders();
        return this.http.delete(this.domain + 'camps/remove_division/' + division._id, this.options).map(function (res) { return res.json(); });
    };
    CampsService.prototype.addDivisionToCounselor = function (counselor) {
        this.createAuthenticationHeaders();
        return this.http.post(this.domain + 'camps/add_division_counselor', counselor, this.options).map(function (res) { return res.json(); });
    };
    /* HEAD STAFF */
    CampsService.prototype.registerHeadStaff = function (user) {
        this.createAuthenticationHeaders();
        return this.http.post(this.domain + 'camps/register_head_staff', user, this.options).map(function (res) { return res.json(); });
    };
    CampsService.prototype.getAllHeads = function () {
        this.createAuthenticationHeaders();
        return this.http.get(this.domain + 'camps/all_heads', this.options).map(function (res) { return res.json(); });
    };
    CampsService.prototype.removeHead = function (head) {
        this.createAuthenticationHeaders();
        return this.http.delete(this.domain + 'camps/remove_head/' + head._id, this.options).map(function (res) { return res.json(); });
    };
    CampsService.prototype.addHeadToDivision = function (division) {
        this.createAuthenticationHeaders();
        return this.http.post(this.domain + 'camps/add_head_division', division, this.options).map(function (res) { return res.json(); });
    };
    CampsService.prototype.removeHeadFromDivision = function (division_id, leader_id) {
        this.createAuthenticationHeaders();
        var data = {
            "division_id": division_id,
            "leader_id": leader_id
        };
        return this.http.post(this.domain + 'camps/remove_head_division', data, this.options).map(function (res) { return res.json(); });
    };
    return CampsService;
}());
CampsService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_http__["Http"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_http__["Http"]) === "function" && _b || Object])
], CampsService);

var _a, _b;
//# sourceMappingURL=camps.service.js.map

/***/ }),

/***/ "../../../../../src/app/services/module.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ModuleService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__auth_service__ = __webpack_require__("../../../../../src/app/services/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ModuleService = (function () {
    function ModuleService(authService, http) {
        this.authService = authService;
        this.http = http;
        this.domain = this.authService.domain;
    }
    // Function to create headers, add token, to be used in HTTP requests
    ModuleService.prototype.createAuthenticationHeaders = function () {
        this.authService.loadToken(); // Get token so it can be attached to headers
        // Headers configuration options
        this.options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["RequestOptions"]({
            headers: new __WEBPACK_IMPORTED_MODULE_2__angular_http__["Headers"]({
                'Content-Type': 'application/json',
                'authorization': this.authService.authToken // Attach token
            })
        });
    };
    ModuleService.prototype.registerModule = function (mod) {
        this.createAuthenticationHeaders();
        return this.http.post(this.domain + 'modules/add_module', mod, this.options).map(function (res) { return res.json(); });
    };
    ModuleService.prototype.removeModule = function (mod) {
        this.createAuthenticationHeaders();
        return this.http.delete(this.domain + 'modules/remove_module/' + mod._id, this.options).map(function (res) { return res.json(); });
    };
    ModuleService.prototype.getAllModules = function () {
        this.createAuthenticationHeaders();
        return this.http.get(this.domain + 'modules/all_modules', this.options).map(function (res) { return res.json(); });
    };
    return ModuleService;
}());
ModuleService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_http__["Http"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_http__["Http"]) === "function" && _b || Object])
], ModuleService);

var _a, _b;
//# sourceMappingURL=module.service.js.map

/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map