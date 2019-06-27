package com.univents;

import android.app.Application;

import com.crashlytics.android.Crashlytics;
import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.microsoft.codepush.react.CodePush;
import org.reactnative.camera.RNCameraPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import io.fabric.sdk.android.Fabric;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.microsoft.codepush.react.CodePush;
import java.util.Arrays;
import java.util.List;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.rnfs.RNFSPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

public class MainApplication extends Application implements ReactApplication {

private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {


        @Override
        public boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
        }

        @Override
        protected String getJSBundleFile() {
                return CodePush.getJSBundleFile();
        }


        @Override
        protected List<ReactPackage> getPackages() {
                return Arrays.<ReactPackage>asList(
                        new MainReactPackage(),
            new RNFetchBlobPackage(),
            new VectorIconsPackage(),
            new SvgPackage(),
            new MapsPackage(),
            new ImagePickerPackage(),
            new RNFSPackage(),
            new FastImageViewPackage(),
            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
            new RNCameraPackage(),
            new LottiePackage(),
                        new ImagePickerPackage(),
                        new VectorIconsPackage(),
                        new MapsPackage(),
                        new RNCameraPackage(),
                        new RNFetchBlobPackage(),
                        new SvgPackage(),
                        new RNFSPackage(),
                        new FastImageViewPackage(),
                        new LottiePackage(),
                        new CodePush("T2KHKkNkbXe6eRIOFqqpzy4Lx9khrJMzF_gKE", MainApplication.this, BuildConfig.DEBUG),
                        new RNFirebasePackage(),
                        new RNFirebaseMessagingPackage(),
                        new RNFirebaseNotificationsPackage()
                        );
        }

        @Override
        protected String getJSMainModuleName() {
                return "index";
        }




};

@Override
public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
}

@Override
public void onCreate() {
        super.onCreate();
        Fabric.with(this, new Crashlytics());
        SoLoader.init(this, /* native exopackage */ false);
}
}
