import React from 'react';
import { Route } from 'react-router-dom';

export default (
  <Route>
    <Route path="/" />
    <Route path="/login" />
    <Route path="/signup" />
    <Route path="/forgot-password" />
    <Route path="/reset-password" />
    <Route path="/dashboard" />
    <Route path="/store" />
    <Route path="/create-shop" />
    <Route path="/shop/:shopId" />
    <Route path="/shop/:shopId/edit" />
    <Route path="/education" />
    <Route path="/education/institute/:id" />
    <Route path="/education/institute/:id/dashboard" />
    <Route path="/education/institute/:id/student-dashboard" />
    <Route path="/education/institute/:id/courses" />
    <Route path="/education/institute/:id/apply" />
    <Route path="/education/create" />
    <Route path="/education/edit/:id" />
    <Route path="/education/dashboard" />
    <Route path="/education/institute-dashboard" />
    <Route path="/education/applications" />
    <Route path="/hospital" />
    <Route path="/hospital/:id" />
    <Route path="/hospital/:id/dashboard" />
    <Route path="/hospital/:id/technicalities" />
    <Route path="/hospital/:id/apply" />
    <Route path="/hospital/:id/patient-dashboard" />
    <Route path="/hospital/create" />
    <Route path="/hospital/edit/:id" />
    <Route path="/hospital/dashboard" />
    <Route path="/feed" />
    <Route path="/feed/post/:id" />
    <Route path="/feed/profile/:username" />
    <Route path="/feed/profile" />
    <Route path="/feed/create" />
    <Route path="/feed/friends" />
    <Route path="/feed/followers" />
    <Route path="/feed/notifications" />
    <Route path="/marketplace" />
    <Route path="/marketplace/product/:productId" />
    <Route path="/marketplace/create" />
    <Route path="/marketplace/edit/:productId" />
    <Route path="/marketplace/dashboard" />
    <Route path="/store/shop/:shopId" />
    <Route path="/auth" />
  </Route>
);
