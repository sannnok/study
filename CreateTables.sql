-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema 1c_database
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema 1c_database
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `1c_database` DEFAULT CHARACTER SET utf8 ;
USE `1c_database` ;

-- -----------------------------------------------------
-- Table `1c_database`.`tbl_nomenclature`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `1c_database`.`tbl_nomenclature` (
  `id` INT NOT NULL,
  `elem` VARCHAR(100) NOT NULL,
  `comment` VARCHAR(100) NULL,
  `bazov_ed_izm` VARCHAR(45) NULL,
  `stavkaNDS` VARCHAR(45) NULL,
  `nomenkl_gruppa` VARCHAR(45) NULL,
  `vid_nomenkl` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `1c_database`.`tbl_price_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `1c_database`.`tbl_price_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `elem` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `elem_UNIQUE` (`elem` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `1c_database`.`tbl_price`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `1c_database`.`tbl_price` (
  `id_price_type` INT NOT NULL,
  `id_nom` INT NOT NULL,
  `price` VARCHAR(10) NOT NULL,
  `date` DATE NOT NULL,
  `currency` VARCHAR(10) NOT NULL,
  `edizm` VARCHAR(10) NOT NULL,
  INDEX `fk_tbl_price_tbl_nomenclature_idx` (`id_nom` ASC),
  PRIMARY KEY (`id_price_type`, `id_nom`),
  INDEX `fk_tbl_price_tbl_price_type1_idx` (`id_price_type` ASC),
  CONSTRAINT `fk_tbl_price_tbl_nomenclature`
    FOREIGN KEY (`id_nom`)
    REFERENCES `1c_database`.`tbl_nomenclature` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_tbl_price_tbl_price_type1`
    FOREIGN KEY (`id_price_type`)
    REFERENCES `1c_database`.`tbl_price_type` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `1c_database`.`tbl_sklad_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `1c_database`.`tbl_sklad_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `1c_database`.`tbl_sklad`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `1c_database`.`tbl_sklad` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `code` VARCHAR(2) NOT NULL,
  `type_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_tbl_sklad_tbl_sklad_type1_idx` (`type_id` ASC),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC),
  UNIQUE INDEX `code_UNIQUE` (`code` ASC),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  CONSTRAINT `fk_tbl_sklad_tbl_sklad_type1`
    FOREIGN KEY (`type_id`)
    REFERENCES `1c_database`.`tbl_sklad_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `1c_database`.`tbl_amount`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `1c_database`.`tbl_amount` (
  `id_nom` INT NOT NULL,
  `id_sklad` INT NOT NULL,
  `number` VARCHAR(9) NOT NULL,
  PRIMARY KEY (`id_nom`, `id_sklad`),
  INDEX `fk_tbl_nomenclature_has_tbl_sklad_tbl_sklad1_idx` (`id_sklad` ASC),
  INDEX `fk_tbl_nomenclature_has_tbl_sklad_tbl_nomenclature1_idx` (`id_nom` ASC),
  CONSTRAINT `fk_tbl_nomenclature_has_tbl_sklad_tbl_nomenclature1`
    FOREIGN KEY (`id_nom`)
    REFERENCES `1c_database`.`tbl_nomenclature` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_nomenclature_has_tbl_sklad_tbl_sklad1`
    FOREIGN KEY (`id_sklad`)
    REFERENCES `1c_database`.`tbl_sklad` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `1c_database`.`tbl_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `1c_database`.`tbl_user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(45) NULL,
  `type_price` VARCHAR(45) NULL,
  `company` VARCHAR(45) NULL,
  `firstname` VARCHAR(45) NULL,
  `lastname` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `user_id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `1c_database`.`tbl_order`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `1c_database`.`tbl_order` (
  `user_id` INT NOT NULL,
  `nom_id` INT NOT NULL,
  `sklad` INT NOT NULL,
  `count` VARCHAR(45) NOT NULL,
  `price_type` VARCHAR(45) NOT NULL,
  `currency` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`user_id`, `nom_id`, `sklad`),
  INDEX `fk_tbl_order_tbl_sklad1_idx` (`sklad` ASC),
  CONSTRAINT `fk_tbl_order_tbl_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `1c_database`.`tbl_user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_order_tbl_nomenclature1`
    FOREIGN KEY (`nom_id`)
    REFERENCES `1c_database`.`tbl_nomenclature` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_order_tbl_sklad1`
    FOREIGN KEY (`sklad`)
    REFERENCES `1c_database`.`tbl_sklad` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;