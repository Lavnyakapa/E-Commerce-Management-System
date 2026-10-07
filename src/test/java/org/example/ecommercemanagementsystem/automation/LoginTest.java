package org.example.ecommercemanagementsystem.automation;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.edge.EdgeDriver;

public class LoginTest {

    public static void main(String[] args) {

        WebDriver driver = new EdgeDriver();

        // Open Login page
        driver.get("http://localhost:5173/login");

        // Enter email
        driver.findElement(By.id("email_"))
                .sendKeys("logintest1@gmail.com");

        // Enter password
        driver.findElement(By.id("password"))
                .sendKeys("Login@123");

        // Click Login
        driver.findElement(By.className("login-btn"))
                .click();

        System.out.println("Login test completed");

        // Keep browser open for now
        // driver.quit();
    }
}