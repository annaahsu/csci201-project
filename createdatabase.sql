# SQL Script to generate the tabular SQL database for CSCI 201 Group 4 Final Project
DROP DATABASE IF EXISTS csci201project;
CREATE DATABASE csci201project;
USE csci201project;
CREATE TABLE users(
                      username varchar(45) primary key not null,
                      password varchar(512) not null,
                      fname varchar(45) not null,
                      lname varchar(45) not null,
                      email varchar(45) not null,
                      salt varchar(45) not null
);
