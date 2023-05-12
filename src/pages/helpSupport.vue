<template>
  <q-page class="q-pa-md text-lg">
    <div class="q-pa-md q-gutter-md">
      <q-list bordered>
        <q-item>
          <q-item-section>
            <q-item-label>FAQs</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="help_outline" size="md" />
          </q-item-section>
        </q-item>
        <q-list bordered>
          <q-expansion-item
            group="somegroup"
            icon="
signal_cellular_connected_no_internet_0_bar
"
            label="Trouble sending messages"
            default-opened
            header-class="text-light-blue"
          >
            <q-card>
              <q-card-section>
                Make sure you have an internet connection.If you're experiencing
                delayed message delivery, it could be due to poor network
                connectivity
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />

          <q-expansion-item
            group="somegroup"
            icon="file_upload_off"
            label="Trouble downloading and uploading"
            header-class="text-orange"
          >
            <q-card>
              <q-card-section>
                If you're experiencing slow upload speeds, it could be due to
                poor network connectivity
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />

          <q-expansion-item
            group="somegroup"
            icon="explore"
            label="Trouble with Maps"
            header-class="text-pink"
          >
            <q-card>
              <q-card-section>
                Make sure your device's location services are turned on and that
                the app has been granted permission to access them.I map is not
                loading or displaying locations, try closing app after granting
                location permissions and reopening it.If you're experiencing
                inaccurate location data, it could be due to poor GPS signal or
                outdated map data.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />

          <q-expansion-item
            group="somegroup"
            icon="password"
            label="Change password"
            header-class="text-yellow"
            expand-icon-class="text-yellow"
          >
            <q-card class="">
              <q-card-section>
                You cannot change your password currently.Contact us on mail for
                any further queries
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>

        <!-- <q-item>
          <q-item-section>
            <q-item-label>Support Center</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info_outline" size="md" />
          </q-item-section>
        </q-item> -->
      </q-list>

      <q-list bordered>
        <q-item class="">
          <q-item-section>
            <q-item-label>Mail Us </q-item-label>
          </q-item-section>
          <q-item-section side class="flex">
            <a
              href="mailto:sa.idesofmarch@gmail.com?subject
              =Support"
              target="_blank"
            >
              <q-icon name="mail_outline" size="md" />
            </a>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script></script>
