/*
 Navicat Premium Data Transfer

 Source Server         : Local_DB
 Source Server Type    : MySQL
 Source Server Version : 100138
 Source Host           : localhost:3306
 Source Schema         : proxybot_db

 Target Server Type    : MySQL
 Target Server Version : 100138
 File Encoding         : 65001

 Date: 04/07/2020 05:16:06
*/
create database proxy_db;
use proxy_db;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for BLACKLIST
-- ----------------------------
DROP TABLE IF EXISTS `BLACKLIST`;
CREATE TABLE `BLACKLIST`  (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `URL` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `created_at` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for history
-- ----------------------------
DROP TABLE IF EXISTS `history`;
CREATE TABLE `history`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_bin NULL,
  `created_at` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `type` enum('daily','weekly','monthly') CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT 'daily',
  `amount` decimal(10, 2) NULL DEFAULT 0.00,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for IPMASTER
-- ----------------------------
DROP TABLE IF EXISTS `IPMASTER`;
CREATE TABLE `IPMASTER`  (
  `IPID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `IPADDRESS` int(12) UNSIGNED NOT NULL,
  `STATUS` tinyint(1) NULL DEFAULT 0,
  `MUL` int(2) UNSIGNED NOT NULL,
  `USED` int(2) UNSIGNED NOT NULL,
  `SUBNET` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  PRIMARY KEY (`IPID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for PROXYMASTER
-- ----------------------------
DROP TABLE IF EXISTS `PROXYMASTER`;
CREATE TABLE `PROXYMASTER`  (
  `PXYID` int(4) UNSIGNED NOT NULL AUTO_INCREMENT,
  `USERID` int(3) UNSIGNED NOT NULL,
  `IPID` int(4) UNSIGNED NOT NULL,
  `PORT` int(5) UNSIGNED NOT NULL,
  `SDATE` date NOT NULL,
  `STIME` time(0) NOT NULL,
  `EDATE` date NOT NULL,
  `ETIME` time(0) NOT NULL,
  PRIMARY KEY (`PXYID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Compact;

DROP TABLE IF EXISTS `TEMP_PROXYMASTER`;
CREATE TABLE `TEMP_PROXYMASTER`  (
  `PXYID` int(11) NOT NULL AUTO_INCREMENT,
  `SDATE` date NULL DEFAULT NULL,
  `GROUPID` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`PXYID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for USERMASTER
-- ----------------------------
DROP TABLE IF EXISTS `USERMASTER`;
CREATE TABLE `USERMASTER`  (
  `USERID` int(3) UNSIGNED NOT NULL AUTO_INCREMENT,
  `USERNAME` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `PASSWORD` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `TYPE` varchar(1) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `NOTES` varchar(1024) CHARACTER SET utf8 COLLATE utf8_bin,
  PRIMARY KEY (`USERID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `amount` int(11) NOT NULL DEFAULT 1,
  `type` enum('daily','weekly','monthly') CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'daily' COMMENT '0:daily, 1:weekly, 2: monthly',
  `created_at` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `order_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `server_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `price` decimal(10, 2) NULL DEFAULT 0.00,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Compact;

SET FOREIGN_KEY_CHECKS = 1;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
flush privileges;
