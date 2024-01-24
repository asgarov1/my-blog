# Java Generate QR Code with Payment Info

It is possible to generate QR codes that can then be used. In Austria banking apps also allow you
to scan these QR codes and make payments based on these scans.

To start with we will create a maven project with `zxing` library for generating QR codes
and also add `commons-lang3` for some convenience methods. Our `pom.xml` looks like this

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.asgarov</groupId>
    <artifactId>qrCodeGenerator</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <javase.version>3.5.2</javase.version>
        <commons-lang3.version>3.14.0</commons-lang3.version>
    </properties>

  <dependencies>
      <dependency>
          <groupId>com.google.zxing</groupId>
          <artifactId>javase</artifactId>
          <version>${javase.version}</version>
      </dependency>
      <dependency>
          <groupId>org.apache.commons</groupId>
          <artifactId>commons-lang3</artifactId>
          <version>${commons-lang3.version}</version>
      </dependency>
  </dependencies>

</project>
```

Next we create our `QrCodeDto` file that has all the fields that we will need:

```java
package com.asgarov.qr.dto;

import org.apache.commons.lang3.StringUtils;

import java.util.Objects;

import static com.asgarov.qr.util.StringUtil.getSubstringIfExists;
import static java.util.Optional.ofNullable;
import static org.apache.commons.lang3.StringUtils.firstNonEmpty;


/**
 * A Dto for QrCode information
 * See:
 * <a href="https://zv.psa.at/de/download/qr-code.html">Documentation for QR Code Standard</a>
 * <a href="https://zv.psa.at/de/qr-code-generator.html">Online Generator to understand Payload better</a>
 *
 * @author xasgarov
 */
public class QrCodeDto {

    public QrCodeDto(String serviceTag, String version, int coding, String function, String bic, String receiver, String iban, String amount, String currency, String purpose, String reference, String text, String displayNote) {
        this.serviceTag = serviceTag;
        this.version = version;
        this.coding = coding;
        this.function = function;
        this.bic = bic;
        this.receiver = receiver;
        this.iban = iban;
        this.amount = amount;
        this.currency = currency;
        this.purpose = purpose;
        this.reference = reference;
        this.text = text;
        this.displayNote = displayNote;
    }

    /**
     * 3 Character ServiceTag, e.g. `BCD`
     */
    private final String serviceTag;

    /**
     * 3 Character Version, e.g. `001` or `002`
     */
    private final String version;

    /**
     * Encoding, possible Values:
     * 1: UTF-8
     * 2: ISO-8859-1
     * 3: ISO-8859-2
     * 4: ISO-8859-4
     * 5: ISO-8859-5
     * 6: ISO-8859-7
     * 7: ISO-8859-10
     * 8: ISO-8859-15
     */
    private final int coding;

    /**
     * 3 Character Function, e.g. `SCT`, which means `SEPA Credit Transfer`
     */
    private final String function;

    /**
     * 8 oder 11 Character BIC, e.g. `RLNWATWW`
     */
    private final String bic;
    private final String receiver;
    private final String iban;
    private String amount;
    private String currency;
    private String purpose;
    private String reference;

    /**
     * Text, mutually exclusive with reference
     */
    private String text;
    private String displayNote;

    /**
     * Generates the payload (in String format) from which the QrCode Image 
     * will be created
     * @return Payload in Text Format
     */
    public String toPayload() {
        if (!StringUtils.isEmpty(reference) && !StringUtils.isEmpty(text)) {
            System.out.printf("Reference '%s' and text '%s' are mutually exclusive, ONLY reference will be put into QR Code%n", reference, text);
        }

        return firstNonEmpty(serviceTag, "") + "\n" +
                ofNullable(version).orElse("") + "\n" +
                coding + "\n" +
                ofNullable(function).orElse("") + "\n" +
                ofNullable(bic).orElse("") + "\n" +
                ofNullable(receiver).orElse("") + "\n" +
                ofNullable(iban).orElse("") + "\n" +
                ofNullable(currency).orElse("") + ofNullable(amount).orElse("") + "\n" +
                ofNullable(purpose).orElse("") + "\n" +
                ofNullable(reference).orElse("") + "\n" +
                ofNullable(text).orElse("") + "\n" +
                ofNullable(displayNote).orElse("");
    }
}
```

This class is a simple dto and the only important part is the `toPayload()` method which
returns a String formatted to produce the QR code. According to the BCD standard,
information should be present in this order, and on each line separate piece
of information.

Next we create our `QrCodeGeneratorUtil`:

```java
package com.asgarov.qr.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.util.EnumMap;
import java.util.Map;

public class QrCodeGeneratorUtil {

    public static BufferedImage createQrImage(String qrCodeText, int size) throws WriterException {
        BitMatrix bitMatrix = createBitMatrix(qrCodeText, size);
        return createBufferedImage(bitMatrix);
    }

    private static BufferedImage createBufferedImage(BitMatrix bitMatrix) {
        int matrixWidth = bitMatrix.getWidth();
        BufferedImage image = new BufferedImage(matrixWidth, matrixWidth, BufferedImage.TYPE_INT_RGB);

        // Create white rectangle for the QrCode
        image.createGraphics();
        Graphics graphics = image.getGraphics();
        graphics.setColor(Color.WHITE);
        graphics.fillRect(0, 0, matrixWidth, matrixWidth);

        // Paint and save the image using the BitMatrix
        paintQrCode(bitMatrix, graphics, matrixWidth);
        return image;
    }

    private static void paintQrCode(BitMatrix bitMatrix, Graphics graphics, int matrixWidth) {
        graphics.setColor(Color.BLACK);
        for (int i = 0; i < matrixWidth; i++) {
            for (int j = 0; j < matrixWidth; j++) {
                if (bitMatrix.get(i, j)) {
                    graphics.fillRect(i, j, 1, 1);
                }
            }
        }
    }

    private static BitMatrix createBitMatrix(String qrCodeText, int size) throws WriterException {
        Map<EncodeHintType, ErrorCorrectionLevel> hintMap = new EnumMap<>(EncodeHintType.class);
        hintMap.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        return qrCodeWriter.encode(qrCodeText, BarcodeFormat.QR_CODE, size, size, hintMap);
    }
}
```

This should be pretty self-explanatory, we first create the BitMatrix (a way of encoding 
a textual information into a matrix of bits - ones and zeroes). This is done with the
`com.google.zxing.qrcode.QRCodeWriter` class.

We then:
1. Create a white rectangle:
```java
Graphics graphics = image.getGraphics();
graphics.setColor(Color.WHITE);
graphics.fillRect(0, 0, matrixWidth, matrixWidth);`)
```
2. On that white rectangle we paint black dots in accordance with out BitMatrix:
```java
if (bitMatrix.get(i, j)) {
   graphics.fillRect(i, j, 1, 1);
}
```
3. Lastly we return the result Image: `return image;`

---

Now that we implemented the functionality, we can generate a QR Code in our runner class:

```java
package com.asgarov.qr;

import com.asgarov.qr.dto.QrCodeDto;
import com.asgarov.qr.util.QrCodeGeneratorUtil;
import com.google.zxing.WriterException;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class Runner {

    public static void main(String[] args) throws WriterException, IOException {
        QrCodeDto qrCodeDto = new QrCodeDto(
                "BCD",
                "001",
                1,
                "SCT",
                "OPSKATWW",
                "Max Mustermann",
                "AT026000000001349870",
                "25",
                "EUR",
                "",
                "test reference",
                "",
                ""
        );

        int size = 95;
        BufferedImage qrImage = QrCodeGeneratorUtil.createQrImage(qrCodeDto.toPayload(), size);

        // write to file system
        String filePath = "myQrCode.png";
        ImageIO.write(qrImage, "png", new File(filePath));
    }
}
```
---

If you run this code you will get a QrCode that looks like this one, which
you can then scan with your banking app to make payments:
<br/>
<img width=8% src="assets/images/myQrCode.png">  
