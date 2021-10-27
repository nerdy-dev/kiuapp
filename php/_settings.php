<div class="modal fade" tabindex="-1" id="settings">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="welcome-hide">
                    <h6 data-lang="more_status" class="text-center"></h6>
                    <div class="setting">
                        <div data-lang="user_name" class="setting-name"></div>
                        <div id="user_name" class="setting-name text-center"><?php out($_USER_INFO['full_name']); ?></div>
                    </div>
                    <div class="setting">
                        <div data-lang="schedule_last_updated" class="setting-name"></div>
                        <div id="last_updated" class="setting-name text-center"></div>
                    </div>
                    <div class="setting">
                        <div data-lang="kiu_services" class="setting-name"></div>
                        <div class="setting-name text-center">
                            <div class="bulb" id="kiu_services"></div>
                        </div>
                    </div>
                    <p class="mb-0 text-center">
                        <button class="btn btn-outline-bm mt-2 disabled" id="force_update">
                            <i class="fas fa-sync-alt me-2"></i>
                            <span data-lang="force_update"></span>
                        </button>
                    </p>
                    <hr>
                    <h6 data-lang="more_preferences" class="text-center"></h6>
                    <div class="setting">
                        <div data-lang="more_language" class="setting-name"></div>
                        <div class="setting-input">
                            <select class="form-select text-center" id="lang_selector">
                                <option data-lang="more_language_english" value="EN" <?php echo $_USER_INFO['pref_language'] == 'EN' ? ' selected' : ''; ?>></option>
                                <option data-lang="more_language_russian" value="RU" <?php echo $_USER_INFO['pref_language'] == 'RU' ? ' selected' : ''; ?>></option>
                            </select>
                        </div>
                    </div>
                    <div class="setting">
                        <div data-lang="more_appearance" class="setting-name"></div>
                        <div class="setting-input">
                            <select class="form-select text-center" id="lightmode_selector">
                                <option data-lang="more_appearance_system" value="system" <?php echo $_USER_INFO['pref_theme'] == 'system' ? ' selected' : ''; ?>></option>
                                <option data-lang="more_appearance_light" value="light" <?php echo $_USER_INFO['pref_theme'] == 'light' ? ' selected' : ''; ?>></option>
                                <option data-lang="more_appearance_dark" value="dark" <?php echo $_USER_INFO['pref_theme'] == 'dark' ? ' selected' : ''; ?>></option>
                            </select>
                        </div>
                    </div>
                    <div class="setting">
                        <div data-lang="more_update" class="setting-name"></div>
                        <div class="setting-input">
                            <select class="form-select text-center" id="update_time_selector">
                                <option data-lang="more_update_6h" value="6" <?php echo $_USER_INFO['pref_update_time'] == 6 ? ' selected' : ''; ?>></option>
                                <option data-lang="more_update_12h" value="12" <?php echo $_USER_INFO['pref_update_time'] == 12 ? ' selected' : ''; ?>></option>
                                <option data-lang="more_update_24h" value="24" <?php echo $_USER_INFO['pref_update_time'] == 24 ? ' selected' : ''; ?>></option>
                            </select>
                        </div>
                    </div>
                    <p class="text-center mt-3">
                        <a href="#signout" class="btn btn-outline-danger"><i class="fas fa-sign-out-alt me-2"></i> <span data-lang="sign_out"></span></a>
                    </p>
                    <hr>
                </div>
                <h6 data-lang="more_installing" class="text-center"></h6>
                <div class="accordion accordion-flush" id="installAcc">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button text-center collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#installiOS">
                                iOS
                            </button>
                        </h2>
                        <div id="installiOS" class="accordion-collapse collapse" data-bs-parent="#installAcc">
                            <div class="accordion-body">
                                <div data-lang="install_ios_safari" data-lang-html class="alert alert-outline-bm text-center"></div>
                                <p data-lang="install_ios_1" data-lang-html class="mb-0 text-center"></p>
                                <img src="img/ios_install_1.png" alt="iOS Installation Step 1" class="img-fluid">
                                <p data-lang="install_ios_2" data-lang-html class="mb-0 text-center"></p>
                                <img data-lang="install_ios_image_2" data-lang-attr="src" src="" alt="iOS Installation Step 2" class="img-fluid">
                                <p data-lang="install_ios_3" data-lang-html class="mb-0 text-center"></p>
                                <img data-lang="install_ios_image_3" data-lang-attr="src" src="" alt="iOS Installation Step 3" class="img-fluid">
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button text-center collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#installAndroid">
                                Android
                            </button>
                        </h2>
                        <div id="installAndroid" class="accordion-collapse collapse" data-bs-parent="#installAcc">
                            <div class="accordion-body">
                                <p class="text-center" data-lang="install_android_1"></p>
                                <p class="text-center">
                                    <a class="btn btn-bm" href="#install" data-lang="install_button"></a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button text-center collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#installWindows">
                                Windows
                            </button>
                        </h2>
                        <div id="installWindows" class="accordion-collapse collapse" data-bs-parent="#installAcc">
                            <div class="accordion-body">
                                <p class="text-center" data-lang="install_windows_1"></p>
                                <p class="text-center">
                                    <a class="btn btn-bm" href="#install" data-lang="install_button"></a>
                                </p>
                                <p class="text-center mb-0 text-muted" data-lang="install_windows_2"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <h6 data-lang="more_about" class="text-center"></h6>
            <div class="accordion accordion-flush" id="aboutAcc">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button data-lang="more_about_contact" class="accordion-button text-center collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#aboutContact"></button>
                    </h2>
                    <div id="aboutContact" class="accordion-collapse collapse" data-bs-parent="#aboutAcc">
                        <div class="accordion-body">
                            <p class="text-center">
                                <a target="_blank" href="https://m.vk.com/kupriashovy" class="btn btn-social btn-vk"><i class="fab fa-vk"></i></a>
                                <a target="_blank" href="https://t.me/kupriashov" class="btn btn-social btn-tg"><i class="fab fa-telegram-plane"></i></a>
                                <a target="_blank" href="mailto:kiuapp@ykmail.ru" class="btn btn-social btn-secondary"><i class="far fa-envelope me-1"></i><span>kiuapp@ykmail.ru</span></a>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button data-lang="more_about_license" class="accordion-button text-center collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#aboutLicense"></button>
                    </h2>
                    <div id="aboutLicense" class="accordion-collapse collapse" data-bs-parent="#aboutAcc">
                        <div class="accordion-body">
                            <div class="alert alert-dark">
                                <p class="text-center">MIT License</p>
                                <p class="text-center">Copyright (c) 2021 Yaroslav Kupriashov</p>
                                <p class="text-justify">
                                    Permission is hereby granted, free of charge, to any person obtaining a copy
                                    of this software and associated documentation files (the "Software"), to deal
                                    in the Software without restriction, including without limitation the rights
                                    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                                    copies of the Software, and to permit persons to whom the Software is
                                    furnished to do so, subject to the following conditions:
                                </p>
                                <p class="text-justify">
                                    The above copyright notice and this permission notice shall be included in all
                                    copies or substantial portions of the Software.
                                </p>
                                <p class="text-justify">
                                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                                    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                                    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                                    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                                    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                                    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                                    SOFTWARE.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer justify-content-center">
                <p class="text-muted text-center">© 2021 Yaroslav Kupriashov <a class="link-bm" href="https://badm.dev/" target="_blank">badm.dev</a></p>
            </div>
        </div>
    </div>
</div>